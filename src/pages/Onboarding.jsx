import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Trash2,
  GripVertical,
  Calendar,
  Droplets,
  Sun,
  Leaf,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import logo from "../assets/logo.svg";
import "../styles/Onboarding.css";

// Import crop images
import wheatImg from "../assets/crops/wheat.png";
import barleyImg from "../assets/crops/barley.png";
import lentilsImg from "../assets/crops/lentils.png";
import chickpeasImg from "../assets/crops/chickpeas.png";
import olivesImg from "../assets/crops/olives.png";
import pomegranateImg from "../assets/crops/pomegranate.png";
import figImg from "../assets/crops/fig.png";
import potatoesImg from "../assets/crops/potatoes.png";
import tomatoesImg from "../assets/crops/tomatoes.png";
import carrotsImg from "../assets/crops/carrots.png";
import lucerneImg from "../assets/crops/lucerne.png";
import cornImg from "../assets/crops/corn.png";

// Crop name to image mapping
const cropImages = {
  قمح: wheatImg,
  شعير: barleyImg,
  عدس: lentilsImg,
  حمص: chickpeasImg,
  زيتون: olivesImg,
  رمان: pomegranateImg,
  تين: figImg,
  بطاطس: potatoesImg,
  طماطم: tomatoesImg,
  جزر: carrotsImg,
  "فصة (لوزيرن)": lucerneImg,
  "الذرة العلفية": cornImg,
};

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

// Component to handle map clicks for drawing
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Component for draggable markers with custom styling
function DraggableMarker({ position, index, onDragEnd }) {
  // Create custom icon with green styling
  const customIcon = L.divIcon({
    className: "custom-point-marker",
    html: `<div class="point-marker-inner">${index + 1}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const newPos = event.target.getLatLng();
          onDragEnd(index, [newPos.lat, newPos.lng]);
        },
      }}
    >
      <Popup>نقطة {index + 1}</Popup>
    </Marker>
  );
}

// Function to calculate polygon area using Shoelace formula (in square meters)
function calculatePolygonArea(points) {
  if (points.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[j];
    area += lat1 * lng2 - lat2 * lng1;
  }

  // Convert to square kilometers (rough approximation)
  // At equator: 1 degree lat = 111km, 1 degree lng = 111km
  // More accurate would use proper geographic calculations, but this is a good approximation
  const absArea = Math.abs(area) / 2;
  const avgLat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const metersPerDegreeLat = 111320.92;
  const metersPerDegreeLng = 111320.92 * Math.cos((avgLat * Math.PI) / 180);

  const areaInSquareMeters = absArea * metersPerDegreeLat * metersPerDegreeLng;
  const areaInSquareKilometers = areaInSquareMeters / 1000000;
  const areaInHectares = areaInSquareKilometers * 100; // 1 km² = 100 hectares
  const areaInDunam = areaInSquareKilometers * 1000; // 1 km² = 1000 dunam

  return {
    squareMeters: Math.round(areaInSquareMeters),
    squareKilometers: areaInSquareKilometers.toFixed(4),
    hectares: areaInHectares.toFixed(2),
    dunam: Math.round(areaInDunam),
  };
}

const steps = [
  {
    step: "01",
    title: "حدد موقعك",
    desc: "نحصل على موقعك الجغرافي تلقائياً لتتمكن من رؤية بيانات محددة لمنطقتك",
    completed: false,
  },
  {
    step: "02",
    title: "حدد أرضك",
    desc: "ارسم حدود أرضك على الخريطة أو اختر موقع من الخريطة",
    completed: false,
  },
  {
    step: "03",
    title: "اختر المحاصيل",
    desc: "اختر المحاصيل التي تريد زراعتها لتتلقى توصيات مخصصة",
    completed: false,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const [drawnPoints, setDrawnPoints] = useState([]); // Points for land boundary
  const [cropsData, setCropsData] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);

  // Fetch crops data from localization.json
  useEffect(() => {
    fetch("/localization.json")
      .then((res) => res.json())
      .then((data) => {
        setCropsData(data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching crops data:", err);
      });
  }, []);

  useEffect(() => {
    // Get user's location automatically
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setMapPosition([latitude, longitude]);

        // Fetch location name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          setLocationName(
            data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "موقعك الحالي",
          );
        } catch (err) {
          console.error("Error fetching location name:", err);
          setLocationName("موقعك الحالي");
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("لم نتمكن من الحصول على موقعك. تأكد من السماح بالوصول للموقع");
        setLoading(false);
      },
    );
  }, []);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMapClick = (point) => {
    setDrawnPoints([...drawnPoints, point]);
  };

  const handleUndoPoint = () => {
    setDrawnPoints(drawnPoints.slice(0, -1));
  };

  const handleClearPoints = () => {
    setDrawnPoints([]);
  };

  const handleDragMarker = (index, newPosition) => {
    const updatedPoints = [...drawnPoints];
    updatedPoints[index] = newPosition;
    setDrawnPoints(updatedPoints);
  };

  // Memoize land area calculation - avoid state update in effect
  const landArea = useMemo(() => {
    if (drawnPoints.length >= 3) {
      return calculatePolygonArea(drawnPoints);
    }
    return null;
  }, [drawnPoints]);

  // Check if user can proceed to next step
  const canProceedToNext = useMemo(() => {
    if (currentStep === steps.length - 1) return false; // Already at last step
    if (currentStep === 1 && drawnPoints.length < 3) return false; // Step 2: need at least 3 points
    return true;
  }, [currentStep, drawnPoints.length]);

  return (
    <div className="onboarding-container" dir="rtl">
      {/* Header */}
      <header className="onboarding-header">
        <div className="onboarding-nav">
          <button className="btn-back" onClick={() => navigate("/")}>
            <ArrowLeft className="icon-back" />
            <span>العودة</span>
          </button>
          <button
            className="logo-container-onboarding"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="GHALTEC Logo"
              className="logo-image-onboarding"
            />
            <span className="logo-text-onboarding">
              <span className="logo-ghal">GHAL</span>
              <span className="logo-tec">TEC</span>
            </span>
          </button>
          <div style={{ width: "100px" }}></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="onboarding-content">
        {/* Steps Progress and Navigation (Sidebar on Desktop) */}
        <div className="onboarding-sidebar">
          <div className="onboarding-steps">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-indicator ${
                  index === currentStep ? "active" : ""
                } ${index < currentStep ? "completed" : ""}`}
              >
                <div className="step-indicator-circle">
                  {index < currentStep ? (
                    <CheckCircle className="icon-check" />
                  ) : (
                    <span className="step-indicator-number">{step.step}</span>
                  )}
                </div>
                <div className="step-indicator-content">
                  <h3 className="step-indicator-title">{step.title}</h3>
                  <p className="step-indicator-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="onboarding-navigation desktop-nav">
            <button
              className="btn-nav btn-nav-secondary"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              السابق
            </button>
            <div className="step-counter">
              {currentStep + 1} / {steps.length}
            </div>
            <button
              className="btn-nav btn-nav-primary"
              onClick={handleNextStep}
              disabled={!canProceedToNext}
            >
              التالي
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="onboarding-main">
          {currentStep === 0 && (
            <div className="step-content">
              <div className="step-content-header">
                <h2 className="step-content-title">
                  {location
                    ? "تم الحصول على موقعك بنجاح ✓"
                    : "جاري الحصول على موقعك..."}
                </h2>
                {location && locationName && (
                  <p className="step-content-subtitle">{locationName}</p>
                )}
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>جاري الحصول على موقعك الجغرافي...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <MapPin className="icon-error" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="map-container">
                  <MapContainer
                    center={mapPosition}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="map"
                    attributionControl={false}
                  >
                    <TileLayer
                      attribution=""
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <Marker position={mapPosition}>
                      <Popup>{locationName || "موقعك الحالي"}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-content">
              <div className="step-content-header">
                <h2 className="step-content-title">حدد أرضك على الخريطة</h2>
                <p className="step-content-subtitle">
                  انقر على الخريطة لتحديد نقاط حدود أرضك (3 نقاط على الأقل)
                </p>
              </div>

              {location && (
                <div className="map-container">
                  <MapContainer
                    center={mapPosition}
                    zoom={15}
                    scrollWheelZoom={true}
                    className="map"
                    attributionControl={false}
                  >
                    <TileLayer
                      attribution=""
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <Marker position={mapPosition}>
                      <Popup>{locationName || "موقع أرضك"}</Popup>
                    </Marker>

                    {/* Display drawn points */}
                    {drawnPoints.map((point, index) => (
                      <DraggableMarker
                        key={`drawn-point-${index}`}
                        position={point}
                        index={index}
                        onDragEnd={handleDragMarker}
                      />
                    ))}

                    {/* Draw polygon if we have 3+ points */}
                    {drawnPoints.length >= 3 && (
                      <Polygon
                        positions={drawnPoints}
                        pathOptions={{
                          color: "#4caf50",
                          weight: 3,
                          opacity: 0.8,
                          fill: true,
                          fillColor: "#4caf50",
                          fillOpacity: 0.2,
                        }}
                      />
                    )}

                    {/* Handle map clicks */}
                    <MapClickHandler onMapClick={handleMapClick} />
                  </MapContainer>
                </div>
              )}

              {/* Points info and area */}
              <div className="step-info">
                {drawnPoints.length === 0 && (
                  <p>ابدأ بالنقر على الخريطة لتحديد الحدود</p>
                )}
                {drawnPoints.length === 1 && (
                  <p>قم بتحديد نقطة أخرى على الأقل</p>
                )}
                {drawnPoints.length === 2 && (
                  <p>قم بتحديد نقطة واحدة أخرى على الأقل</p>
                )}
                {drawnPoints.length >= 3 && landArea && (
                  <div className="area-display">
                    <div className="area-badge">
                      {landArea.hectares}{" "}
                      <span className="area-unit">هكتار</span>
                    </div>
                    <span className="area-hint">
                      يمكنك إضافة المزيد من النقاط لتعديل الحدود
                    </span>
                  </div>
                )}
              </div>

              {/* Drawing controls */}
              <div className="drawing-controls">
                <button
                  className="btn-nav btn-nav-secondary"
                  onClick={handleUndoPoint}
                  disabled={drawnPoints.length === 0}
                >
                  تراجع عن آخر نقطة
                </button>
                <button
                  className="btn-nav btn-nav-secondary"
                  onClick={handleClearPoints}
                  disabled={drawnPoints.length === 0}
                >
                  <Trash2
                    style={{
                      width: "1rem",
                      height: "1rem",
                      display: "inline",
                      marginLeft: "0.5rem",
                    }}
                  />
                  مسح الكل
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <div className="step-content-header">
                <h2 className="step-content-title">اختر المحاصيل</h2>
                <p className="step-content-subtitle">
                  اختر المحاصيل التي تريد زراعتها لتتلقى توصيات مخصصة
                </p>
              </div>

              <div className="crops-grid">
                {cropsData.map((crop, index) => {
                  const isSelected = selectedCrops.includes(crop["المنتج"]);
                  const cropImage = cropImages[crop["المنتج"]];
                  const successRate = parseInt(crop["نسبة النجاح"]);
                  const successClass =
                    successRate >= 85
                      ? "high"
                      : successRate >= 70
                        ? "medium"
                        : "low";
                  return (
                    <div
                      key={index}
                      className={`crop-card ${isSelected ? "selected" : ""}`}
                    >
                      <div className="crop-image-container">
                        {cropImage && (
                          <img
                            src={cropImage}
                            alt={crop["المنتج"]}
                            className="crop-image"
                            loading="lazy"
                          />
                        )}
                        <span className={`crop-success-badge ${successClass}`}>
                          <Star size={12} />
                          {crop["نسبة النجاح"]}
                        </span>
                      </div>

                      <div className="crop-info">
                        <h3 className="crop-name">{crop["المنتج"]}</h3>

                        <div className="crop-details-grid">
                          <div className="crop-detail-item">
                            <Calendar size={16} className="crop-detail-icon" />
                            <div className="crop-detail-text">
                              <span className="crop-detail-label">الموسم</span>
                              <span className="crop-detail-value">
                                {crop["الموسم الزراعي"]}
                              </span>
                            </div>
                          </div>

                          <div className="crop-detail-item">
                            <Droplets size={16} className="crop-detail-icon" />
                            <div className="crop-detail-text">
                              <span className="crop-detail-label">
                                احتياج الماء (لتر/م²/اليوم)
                              </span>
                              <span className="crop-detail-value">
                                {crop["الماء (لتر/م²/اليوم)"]}
                              </span>
                            </div>
                          </div>

                          <div className="crop-detail-item">
                            <Sun size={16} className="crop-detail-icon" />
                            <div className="crop-detail-text">
                              <span className="crop-detail-label">المناخ</span>
                              <span className="crop-detail-value">
                                {crop["المناخ"]}
                              </span>
                            </div>
                          </div>

                          <div className="crop-detail-item">
                            <Leaf size={16} className="crop-detail-icon" />
                            <div className="crop-detail-text">
                              <span className="crop-detail-label">السماد</span>
                              <span className="crop-detail-value">
                                {crop["السماد المناسب"]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className={`crop-select-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCrops(
                                selectedCrops.filter(
                                  (c) => c !== crop["المنتج"],
                                ),
                              );
                            } else {
                              setSelectedCrops([
                                ...selectedCrops,
                                crop["المنتج"],
                              ]);
                            }
                          }}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle size={16} />
                              تم الاختيار
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              اختيار المحصول
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedCrops.length > 0 && (
                <div className="step-info">
                  <p>
                    <strong>المحاصيل المختارة ({selectedCrops.length}):</strong>{" "}
                    {selectedCrops.join("، ")}
                  </p>
                </div>
              )}

              {selectedCrops.length === 0 && (
                <div className="step-info">
                  <p>اختر واحد أو أكثر من المحاصيل التي تريد زراعتها</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons - Mobile Only */}
        <div className="onboarding-navigation mobile-nav">
          <button
            className="btn-nav btn-nav-secondary"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            السابق
          </button>
          <div className="step-counter">
            {currentStep + 1} / {steps.length}
          </div>
          <button
            className="btn-nav btn-nav-primary"
            onClick={handleNextStep}
            disabled={!canProceedToNext}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
