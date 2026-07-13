import {
  useEffect,
  useRef,
  useState,
} from "react";

interface CameraSectionProps {
  onQuestsGenerated?: () => void;
}

export default function CameraSection({
  onQuestsGenerated,
}: CameraSectionProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [capturedImage, setCapturedImage] =
    useState("");

  const [capturedFile, setCapturedFile] =
    useState<File | null>(null);

  const [cameraError, setCameraError] =
    useState("");

  async function openCamera() {
    setCameraError("");
    setCameraLoading(true);
    setCameraOpen(true);
    setCapturedImage("");
    setCapturedFile(null);

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "This browser does not support camera access."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }
    } catch (error) {
      console.error(
        "Could not open camera:",
        error
      );

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser settings."
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "No available camera was found."
        );
      } else {
        setCameraError(
          error instanceof Error
            ? error.message
            : "Could not open the camera."
        );
      }
    } finally {
      setCameraLoading(false);
    }
  }

  function stopCamera() {
    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function closeCamera() {
    stopCamera();

    setCameraOpen(false);
    setCameraLoading(false);
    setCameraError("");
    setCapturedImage("");
    setCapturedFile(null);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "The camera is still loading. Try again."
      );

      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Could not capture the image."
      );

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(
            "Could not create the captured image."
          );

          return;
        }

        const file = new File(
          [blob],
          `questify-room-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        const imageUrl =
          URL.createObjectURL(blob);

        setCapturedImage((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }

          return imageUrl;
        });

        setCapturedFile(file);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  }

  async function retakePhoto() {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }

    setCapturedImage("");
    setCapturedFile(null);
    setCameraError("");

    await openCamera();
  }

  function usePhoto() {
    if (!capturedFile) {
      return;
    }

    /*
      capturedFile is the actual File object
      you will later send to Featherless.

      Example:
      const formData = new FormData();
      formData.append("roomImage", capturedFile);
    */

    closeCamera();
    onQuestsGenerated?.();
  }

  useEffect(() => {
    return () => {
      stopCamera();

      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  return (
    <section className="cameraSection">
      <div className="sectionHeading">
        <div>
          <p className="sectionEyebrow">
            DAILY SCAN
          </p>

          <h2>Discover Today's Quests</h2>
        </div>

        <span className="scanStatus">
          NOT SCANNED
        </span>
      </div>

      <section className="cameraLaunchCard">
        <div className="cameraLaunchGlow" />

        <div className="cameraLaunchIcon">
          📷
        </div>

        <div className="cameraLaunchText">
          <h3>Scan Your Room</h3>

          <p>
            Open the Questify camera, capture your
            room, and discover activities you can
            complete right now.
          </p>
        </div>

        <button
          type="button"
          className="openCameraButton"
          onClick={openCamera}
        >
          <span>📷</span>
          Open Camera
        </button>
      </section>

      <div className="cameraTips">
        <article>
          <span>💡</span>

          <div>
            <strong>Capture the whole room</strong>

            <p>
              Stand near a doorway or corner so more
              objects are visible.
            </p>
          </div>
        </article>

        <article>
          <span>☀️</span>

          <div>
            <strong>Use good lighting</strong>

            <p>
              A bright photo helps the scanner find
              more useful quests.
            </p>
          </div>
        </article>
      </div>

      {cameraOpen && (
        <div
          className="cameraModalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Questify room camera"
        >
          <section className="cameraModal">
            <header className="cameraModalHeader">
              <div>
                <p>QUESTIFY CAMERA</p>
                <h2>Scan Your Room</h2>
              </div>

              <button
                type="button"
                className="closeCameraButton"
                onClick={closeCamera}
                aria-label="Close camera"
              >
                ×
              </button>
            </header>

            <div className="cameraViewport">
              {!capturedImage && (
                <video
                  ref={videoRef}
                  className="liveCameraVideo"
                  autoPlay
                  playsInline
                  muted
                />
              )}

              {capturedImage && (
                <img
                  className="capturedRoomImage"
                  src={capturedImage}
                  alt="Captured room"
                />
              )}

              {!capturedImage &&
                !cameraError && (
                  <>
                    <div className="cameraCorner cameraCornerTopLeft" />
                    <div className="cameraCorner cameraCornerTopRight" />
                    <div className="cameraCorner cameraCornerBottomLeft" />
                    <div className="cameraCorner cameraCornerBottomRight" />

                    <div className="cameraGuide">
                      <span>Move slowly</span>
                      <p>
                        Keep the room inside the frame
                      </p>
                    </div>
                  </>
                )}

              {cameraLoading && (
                <div className="cameraLoadingOverlay">
                  <div className="cameraSpinner" />
                  <p>Opening camera...</p>
                </div>
              )}

              {cameraError && (
                <div className="cameraErrorOverlay">
                  <div>⚠️</div>
                  <h3>Camera unavailable</h3>
                  <p>{cameraError}</p>

                  <button
                    type="button"
                    onClick={openCamera}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            <canvas
              ref={canvasRef}
              className="cameraCanvas"
            />

            {!capturedImage ? (
              <footer className="cameraCaptureControls">
                <div className="cameraControlSpacer" />

                <button
                  type="button"
                  className="capturePhotoButton"
                  onClick={capturePhoto}
                  disabled={
                    cameraLoading ||
                    Boolean(cameraError)
                  }
                  aria-label="Capture room photo"
                >
                  <span />
                </button>

                <div className="cameraModeLabel">
                  PHOTO
                </div>
              </footer>
            ) : (
              <footer className="capturedPhotoControls">
                <button
                  type="button"
                  className="retakePhotoButton"
                  onClick={retakePhoto}
                >
                  ↻ Retake
                </button>

                <button
                  type="button"
                  className="usePhotoButton"
                  onClick={usePhoto}
                >
                  Use Photo ✨
                </button>
              </footer>
            )}
          </section>
        </div>
      )}
    </section>
  );
}