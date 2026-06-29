import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { FiArrowRight, FiStar, FiClock, FiMapPin } from 'react-icons/fi';

const HomePage = () => {
  const { menu, addToCart } = useApp();
  const [addedId, setAddedId] = useState(null);

  // Get highlighted products
  const highlights = menu.filter(item => item.badge === 'Bestseller' || item.badge === 'New').slice(0, 4);
  if (highlights.length < 4) {
    highlights.push(...menu.filter(item => !highlights.includes(item)).slice(0, 4 - highlights.length));
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1, size: 'M' });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="home-page animate-fade-in">
      {/* ── Hero Banner ─────────────────────────────── */}
      <section style={{
        position: 'relative',
        height: '88vh',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '96px',
        overflow: 'hidden'
      }}>
        {/* Background Image - thực tế quán cà phê ấm cúng */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(120deg, rgba(62,43,35,0.92) 0%, rgba(62,43,35,0.55) 60%, rgba(62,43,35,0.15) 100%)',
          zIndex: 1
        }} />

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', bottom: -60, right: -60,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,62,38,0.3) 0%, transparent 70%)',
          zIndex: 1
        }} />

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'left', width: '100%' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              borderRadius: '30px',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>
              <FiStar size={13} style={{ color: '#fcd34d' }} />
              Không Gian Cà Phê Đặc Biệt
            </span>

            <h1 style={{
              color: 'white',
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
              lineHeight: 1.08,
              marginBottom: '24px',
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 800,
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              letterSpacing: '-0.5px'
            }}>
              Cà Phê<br />
              <span style={{ color: '#f9a825' }}>Đúng Chất</span><br />
              Snoopy
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1.15rem',
              marginBottom: '40px',
              lineHeight: 1.7,
              maxWidth: '82%'
            }}>
              Hạt cà phê rang xay tươi mỗi ngày · Không gian ấm cúng · Phục vụ tận tâm
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/menu" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 36px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(107,62,38,0.45)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(107,62,38,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(107,62,38,0.45)'; }}
              >
                Đặt Hàng Ngay <FiArrowRight />
              </Link>
              <Link to="/menu" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 36px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                Xem Thực Đơn
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
              {[
                { icon: <FiStar size={16} />, label: '4.9 ★ Đánh giá' },
                { icon: <FiClock size={16} />, label: '7:00 – 22:00 mỗi ngày' },
                { icon: <FiMapPin size={16} />, label: 'TP. Hồ Chí Minh' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
                  <span style={{ color: '#fcd34d' }}>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Badges ──────────────────────────── */}
      <section className="container" style={{ marginBottom: 80 }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { emoji: '🫘', title: 'Hạt Rang Tươi', desc: 'Rang ngay trong ngày' },
            { emoji: '🧊', title: 'Cold Brew 24h', desc: 'Ngâm lạnh truyền thống' },
            { emoji: '☕', title: 'Barista Chuyên Nghiệp', desc: 'Tay pha có tâm' },
            { emoji: '🌿', title: 'Nguyên Liệu Sạch', desc: 'Tươi & tự nhiên' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 28px',
              background: 'white',
              borderRadius: 16,
              border: '1.5px solid var(--snoopy-border)',
              boxShadow: '0 4px 16px rgba(107,62,38,0.06)',
              minWidth: 200,
              transition: 'all 0.25s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(107,62,38,0.12)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,62,38,0.06)'; e.currentTarget.style.borderColor = 'var(--snoopy-border)'; }}
            >
              <span style={{ fontSize: 36 }}>{f.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--snoopy-brown-dark)', marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Highlights Section ───────────────────────── */}
      <section className="container" style={{ marginBottom: '96px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-block', padding: '5px 18px', background: '#fff3e8', color: 'var(--primary)', borderRadius: 20, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>⭐ Nổi Bật</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: 'var(--snoopy-brown-dark)', marginBottom: 8 }}>
            Sản Phẩm Được Yêu Thích
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Những ly đồ uống được khách hàng lựa chọn nhiều nhất</p>
        </div>

        <div className="grid grid-cols-4">
          {highlights.map(item => {
            const badgeClass = item.badge === 'Bestseller' ? 'badge-bestseller'
              : item.badge === 'New' ? 'badge-new'
                : 'badge-must-try';
            const isAdded = addedId === item.id;

            return (
              <div key={item.id} className="product-card-pro">
                {item.badge && (
                  <span className={`product-badge ${badgeClass}`}>
                    {item.badge}
                  </span>
                )}
                <div className="product-img-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info">
                  <div className="product-name">{item.name}</div>
                  <div className="product-price">{formatPrice(item.price)}</div>
                  <div className="product-action">
                    <button
                      className={isAdded ? 'btn-success-coffee' : 'btn-primary'}
                      style={{ width: '100%', fontSize: '14px', padding: '11px 0', borderRadius: '30px', transition: 'all 0.3s' }}
                      onClick={() => handleAddToCart(item)}
                    >
                      {isAdded ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/menu" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 36px',
            border: '2px solid var(--primary)',
            color: 'var(--primary)',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Xem Toàn Bộ Menu <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Atmosphere Section ───────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #3e2b23 0%, #6b3e26 100%)', padding: '96px 0', marginBottom: 96 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '5px 18px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: 20, fontWeight: 600, fontSize: 13, marginBottom: 20 }}>
                🏡 Về Chúng Tôi
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
                Nơi Cà Phê Gặp Gỡ<br />Những Khoảnh Khắc Đặc Biệt
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 32 }}>
                Snoopy Coffee là không gian cà phê ấm cúng, nơi mỗi ly cà phê được pha bằng cả tâm huyết và sự tỉ mỉ. Chúng tôi chọn lựa những hạt cà phê tốt nhất từ các vùng trồng nổi tiếng và rang xay tươi mỗi ngày.
              </p>
              <div style={{ display: 'flex', gap: 40 }}>
                {[['5+', 'Năm kinh nghiệm'], ['10K+', 'Khách hàng thân thiết'], ['50+', 'Loại đồ uống']].map(([num, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fcd34d', lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=400',
              ].map((src, i) => (
                <div key={i} style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  height: i % 2 === 0 ? 180 : 140,
                  marginTop: i % 2 !== 0 ? 24 : 0,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog/News Section ────────────────────────── */}
      <section style={{ padding: '0 0 96px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-block', padding: '5px 18px', background: '#fff3e8', color: 'var(--primary)', borderRadius: 20, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>📰 Chuyện Cà Phê</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: 'var(--snoopy-brown-dark)', marginBottom: 8 }}>
              Khám Phá Thế Giới Cà Phê
            </h2>
          </div>

          <div className="grid grid-cols-3">
            {[
              {
                title: 'Cold Brew — Xu Hướng Cà Phê Hiện Đại',
                excerpt: 'Cold Brew là cách pha cà phê bằng nước lạnh trong 12–24 giờ, giúp giữ lại trọn vẹn hương thơm nguyên bản và giảm độ chua đáng kể...',
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600',
                tag: 'Pha chế',
                readTime: '3 phút đọc',
              },
              {
                title: 'Nghệ Thuật Latte Art Từ Barista',
                excerpt: 'Đằng sau mỗi hình vẽ đẹp mắt trên tách Cappuccino là sự tỉ mỉ và kỹ thuật điêu luyện của các Barista được đào tạo bài bản...',
                image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
                tag: 'Kỹ thuật',
                readTime: '4 phút đọc',
              },
              {
                title: 'Hành Trình Của Hạt Cà Phê Robusta',
                excerpt: 'Từ những vườn cà phê Tây Nguyên bạt ngàn đến xưởng rang xay, mỗi hạt cà phê đều trải qua hành trình đáng tự hào để đến tay bạn...',
                image: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=600',
                tag: 'Nguồn gốc',
                readTime: '5 phút đọc',
              }
            ].map((blog, idx) => (
              <div key={idx} className="blog-card-pro"
                style={{
                  background: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(107,62,38,0.07)',
                  border: '1.5px solid var(--snoopy-border)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(107,62,38,0.15)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(107,62,38,0.07)'; e.currentTarget.style.borderColor = 'var(--snoopy-border)'; }}
              >
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    background: 'var(--primary)', color: 'white',
                    padding: '4px 12px', borderRadius: 20,
                    fontSize: '11px', fontWeight: 700,
                  }}>{blog.tag}</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '17px', marginBottom: '10px', lineHeight: 1.4, color: 'var(--snoopy-brown-dark)', fontWeight: 700 }}>{blog.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>{blog.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>⏱ {blog.readTime}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Đọc tiếp <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
