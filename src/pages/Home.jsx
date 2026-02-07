import {
  MapPin,
  Droplets,
  Sprout,
  CloudRain,
  TrendingUp,
  Leaf,
  Smartphone,
  BarChart3,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import hero from "../assets/hero.png";
import benefitImg from "../assets/benefits-image.png";
import "../styles/App.css";

export default function Home() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/onboarding");
  };

  return (
    <div className="app-container" dir="rtl">
      {/* Floating Header */}
      <header className="header">
        <nav className="nav">
          <button
            className="logo-container-btn"
            onClick={() => navigate("/")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div className="logo-container">
              <img src={logo} alt="GHALTEC Logo" className="logo-image" />
              <span className="logo-text">
                <span className="logo-ghal">GHAL</span>
                <span className="logo-tec">TEC</span>
              </span>
            </div>
          </button>
          <div className="nav-links">
            <a href="#features" className="nav-link">
              المميزات
            </a>
            <a href="#how" className="nav-link">
              كيف يعمل
            </a>
            <a href="#benefits" className="nav-link">
              الفوائد
            </a>
          </div>
          <div className="nav-actions">
            <button className="btn-secondary">تسجيل الدخول</button>
            <button className="btn-primary" onClick={handleStartFree}>
              ابدأ مجاناً
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge">
                <div className="badge-dot"></div>
                <span className="badge-text">منصة زراعية ذكية ومتطورة</span>
              </div>

              <h1 className="hero-title">
                الزراعة الذكية{" "}
                <span className="gradient-text">تبدأ من هنا</span>
              </h1>

              <p className="hero-description">
                <span className="hero-brand">GHALTEC</span> تقدم لك بيانات
                زراعية دقيقة وموثوقة عبر خريطة تفاعلية. اتخذ قرارات مبنية على
                البيانات لتحسين إنتاجك وتقليل المخاطر.
              </p>

              <div className="hero-buttons">
                <button className="btn-hero-primary" onClick={handleStartFree}>
                  <span>استكشف المنصة</span>
                  <ArrowLeft className="btn-icon" />
                </button>
                <button className="btn-hero-secondary">
                  شاهد العرض التوضيحي
                </button>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value gradient-text">دقة البيانات</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value gradient-text">دعم مستمر</div>
                </div>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <div className="hero-image-glow"></div>
              <div className="hero-image-container">
                <img src={hero} alt="زراعة مغربية" className="hero-image" />
              </div>

              {/* Floating Card */}
              <div className="floating-card">
                <div className="floating-card-content">
                  <div className="floating-card-icon">
                    <TrendingUp className="icon-lg" />
                  </div>
                  <div>  
                    <div className="floating-card-label">
                      زيادة مضمونة في الإنتاجية
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="section-badge-text">المميزات الرئيسية</span>
            </div>
            <h2 className="section-title">
              كل ما تحتاجه في <span className="gradient-text">منصة واحدة</span>
            </h2>
            <p className="section-description">
              أدوات ذكية ومتطورة لمساعدتك في اتخاذ أفضل القرارات الزراعية
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: MapPin,
                title: "خريطة تفاعلية ذكية",
                desc: "تصور أرضك بالتفصيل مع بيانات زراعية في الوقت الفعلي مخصصة لموقعك",
                gradient: "gradient-1",
              },
              {
                icon: Sprout,
                title: "تحليل جودة التربة",
                desc: "بيانات تفصيلية عن تربتك مع توصيات المحاصيل المناسبة لخصائص أرضك",
                gradient: "gradient-2",
              },
              {
                icon: Droplets,
                title: "إدارة المياه الذكية",
                desc: "حسابات دقيقة لاحتياجات المياه مع جداول ري ذكية لتوفير الموارد",
                gradient: "gradient-3",
              },
              {
                icon: CloudRain,
                title: "توقعات مناخية محلية",
                desc: "تنبؤات دقيقة بالطقس وأنماط المناخ للتخطيط بثقة",
                gradient: "gradient-4",
              },
              {
                icon: BarChart3,
                title: "توصيات الأسمدة",
                desc: "نصائح شخصية للأسمدة لزيادة الإنتاج مع تقليل التكاليف",
                gradient: "gradient-5",
              },
              {
                icon: Smartphone,
                title: "منصة إلكترونية سهلة الاستخدام",
                desc: "الوصول لجميع البيانات من هاتفك في أي وقت ومن أي مكان",
                gradient: "gradient-6",
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.gradient}`}>
                  <feature.icon className="icon-md" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
                <div className="feature-hover-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="section-badge-text">العملية بسيطة</span>
            </div>
            <h2 className="section-title">
              كيف يعمل <span className="gradient-text">GHALTEC</span>
            </h2>
          </div>

          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "حدد موقع أرضك",
                desc: "استخدم الخريطة التفاعلية لتحديد موقع مزرعتك بدقة",
                icon: MapPin,
              },
              {
                step: "02",
                title: "احصل على التحليل",
                desc: "نظامنا الذكي يحلل التربة والمناخ والموارد المتاحة",
                icon: BarChart3,
              },
              {
                step: "03",
                title: "ابدأ بالزراعة الذكية",
                desc: "اتبع التوصيات المخصصة وراقب تحسن إنتاجك",
                icon: TrendingUp,
              },
            ].map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-icon-wrapper">
                  <div className="step-icon">
                    <step.icon className="icon-xl" />
                  </div>
                  <div className="step-number">
                    <span className="step-number-text">{step.step}</span>
                  </div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefits-image-wrapper order-2">
              <div className="benefits-image-glow"></div>
              <img
                src={benefitImg}
                alt="زراعة الزيتون في المغرب"
                className="benefits-image"
              />
            </div>

            <div className="benefits-content order-1">
              <div className="section-badge">
                <span className="section-badge-text">لماذا تختار GHALTEC</span>
              </div>

              <h2 className="benefits-title">
                نمو مستدام <span className="gradient-text">وأرباح أكبر</span>
              </h2>

              <div className="benefits-list">
                {[
                  {
                    icon: TrendingUp,
                    title: "زيادة الإنتاج بنسبة تصل إلى 40%",
                    desc: "قرارات مبنية على البيانات تعني محصول أفضل وأرباح أكثر",
                  },
                  {
                    icon: Droplets,
                    title: "توفير 30% من الموارد",
                    desc: "استخدام أمثل للمياه والأسمدة يقلل التكاليف ويحمي البيئة",
                  },
                  {
                    icon: Shield,
                    title: "تقليل المخاطر بشكل كبير",
                    desc: "توقعات دقيقة وتحذيرات مبكرة لحماية محاصيلك",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <benefit.icon className="icon-sm" />
                    </div>
                    <div>
                      <h3 className="benefit-title">{benefit.title}</h3>
                      <p className="benefit-description">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <div className="cta-pattern">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
        </div>

        <div className="container cta-content">
          <h2 className="cta-title">
            ابدأ رحلتك نحو{" "}
            <span className="cta-title-inline">الزراعة الذكية</span>
          </h2>
          <p className="cta-description">
            انضم لآلاف المزارعين الذين حسّنوا إنتاجيتهم مع GHALTEC
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={handleStartFree}>
              <span>ابدأ مجاناً الآن</span>
              <ArrowLeft className="btn-icon" />
            </button>
            <button className="btn-cta-secondary">تحدث مع فريقنا</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Leaf className="icon-md" />
                </div>
                <span className="footer-logo-text">GHALTEC</span>
              </div>
              <p className="footer-description">
                منصة زراعية ذكية تساعد المزارعين على اتخاذ قرارات مبنية على
                البيانات لزيادة الإنتاج وتحقيق الاستدامة
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">الشركة</h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    المدونة
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">الدعم</h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    مركز المساعدة
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 GHALTEC. جميع الحقوق محفوظة
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                تويتر
              </a>
              <a href="#" className="footer-social-link">
                فيسبوك
              </a>
              <a href="#" className="footer-social-link">
                إنستغرام
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
