import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./CameraSection.css";

import type {
  RoomAnalysis,
} from "../types/RoomAnalysis";

interface CameraSectionProps {
  onAnalysisComplete: (
    analysis: RoomAnalysis,
    imageUrl: string
  ) => void;
}

export default function CameraSection({
  onAnalysisComplete,
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

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [capturedImage, setCapturedImage] =
    useState("");

  const [capturedFile, setCapturedFile] =
    useState<File | null>(null);

  const [cameraError, setCameraError] =
    useState("");

  async function openCamera() {
    setCameraOpen(true);
    setCameraLoading(true);
    setCameraError("");
    setCapturedImage("");
    setCapturedFile(null);

    try {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error(
          "Your browser does not support camera access."
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
        "Camera error:",
        error
      );

      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not open the camera."
      );
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
    setAnalysisLoading(false);
    setCameraError("");
    setCapturedImage("");
    setCapturedFile(null);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setCameraError(
        "The camera is not ready."
      );

      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "Wait for the camera to finish loading."
      );

      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Could not capture the photo."
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

    const imageUrl =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(
            "Could not create the image."
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

        setCapturedImage(imageUrl);
        setCapturedFile(file);
        setCameraError("");

        stopCamera();
      },

      "image/jpeg",
      0.9
    );
  }

  async function retakePhoto() {
    setCapturedImage("");
    setCapturedFile(null);
    setCameraError("");

    await openCamera();
  }

  async function analyzePhoto() {
    if (!capturedFile) {
      setCameraError(
        "Capture a photo first."
      );

      return;
    }

    try {
      setAnalysisLoading(true);
      setCameraError("");

      const formData =
        new FormData();

      formData.append(
        "roomImage",
        capturedFile
      );

      const response = await fetch(
        "http://localhost:3001/api/analyze-room",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText =
        await response.text();

      let result: unknown;

      try {
        result =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "The backend returned an invalid response."
        );
      }

      if (!response.ok) {
        const errorResult =
          result as {
            error?: string;
          };

        throw new Error(
          errorResult.error ||
            "Could not generate quests."
        );
      }

      const analysis =
        result as RoomAnalysis;

      if (
        !Array.isArray(
          analysis.quests
        ) ||
        analysis.quests.length === 0
      ) {
        throw new Error(
          "The backend returned no quests."
        );
      }

      onAnalysisComplete(
        analysis,
        capturedImage
      );

      stopCamera();
      setCameraOpen(false);
    } catch (error) {
      console.error(
        "Quest generation error:",
        error
      );

      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not generate quests."
      );
    } finally {
      setAnalysisLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section className="cameraSection">
      <div className="sectionHeading">
        <div>
          <p className="sectionEyebrow">
            DAILY SCAN
          </p>

          <h2>
            Discover Today's Quests
          </h2>
        </div>

        <span className="scanStatus">
          READY
        </span>
      </div>

      <section className="cameraLaunchCard">
        <div className="cameraLaunchIcon">
          📷
        </div>

        <div className="cameraLaunchText">
          <h3>Scan Your Room</h3>

          <p>
            Take a room photo and generate
            personalized quests.
          </p>
        </div>

        <button
          type="button"
          className="openCameraButton"
          onClick={openCamera}
        >
          📷 Open Camera
        </button>
      </section>

      <div className="cameraTips">
        <article>
          <span>💡</span>

          <div>
            <strong>
              Capture the whole room
            </strong>

            <p>
              Stand near a doorway or corner.
            </p>
          </div>
        </article>

        <article>
          <span>☀️</span>

          <div>
            <strong>
              Use good lighting
            </strong>

            <p>
              Keep the room clearly visible.
            </p>
          </div>
        </article>
      </div>

      {cameraOpen && (
        <div
          className="cameraModalBackdrop"
          role="dialog"
          aria-modal="true"
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
                disabled={analysisLoading}
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
                !cameraError &&
                !cameraLoading && (
                  <>
                    <div className="cameraCorner cameraCornerTopLeft" />
                    <div className="cameraCorner cameraCornerTopRight" />
                    <div className="cameraCorner cameraCornerBottomLeft" />
                    <div className="cameraCorner cameraCornerBottomRight" />

                    <div className="cameraGuide">
                      <span>
                        Hold your camera steady
                      </span>

                      <p>
                        Keep the room inside the
                        frame
                      </p>
                    </div>
                  </>
                )}

              {cameraLoading && (
                <div className="cameraLoadingOverlay">
                  <div className="cameraSpinner" />

                  <h3>
                    Opening camera
                  </h3>

                  <p>
                    Allow camera access if
                    prompted.
                  </p>
                </div>
              )}

              {analysisLoading && (
                <div className="cameraLoadingOverlay">
                  <div className="cameraSpinner" />

                  <h3>
                    Creating quests
                  </h3>

                  <p>
                    Questify is processing your
                    room photo.
                  </p>
                </div>
              )}

              {cameraError &&
                !capturedImage && (
                  <div className="cameraErrorOverlay">
                    <div>⚠️</div>

                    <h3>
                      Camera unavailable
                    </h3>

                    <p>{cameraError}</p>

                    <button
                      type="button"
                      onClick={openCamera}
                    >
                      Try Again
                    </button>
                  </div>
                )}

              {cameraError &&
                capturedImage && (
                  <div className="cameraErrorBanner">
                    {cameraError}
                  </div>
                )}
            </div>

            <canvas
              ref={canvasRef}
              className="cameraCanvas"
            />

            {!capturedImage ? (
              <footer className="cameraCaptureControls">
                <div />

                <button
                  type="button"
                  className="capturePhotoButton"
                  onClick={capturePhoto}
                  disabled={
                    cameraLoading ||
                    Boolean(cameraError)
                  }
                  aria-label="Take photo"
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
                  disabled={analysisLoading}
                >
                  ↻ Retake
                </button>

                <button
                  type="button"
                  className="usePhotoButton"
                  onClick={analyzePhoto}
                  disabled={analysisLoading}
                >
                  {analysisLoading
                    ? "Creating Quests..."
                    : "Find Quests ✨"}
                </button>
              </footer>
            )}
          </section>
        </div>
      )}
    </section>
  );
}