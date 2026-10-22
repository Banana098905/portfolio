(function(){
      const canvas = document.getElementById('heroCanvas');
      if(!canvas) return;
      
      let ctx = canvas.getContext('2d');
      let width = 0, height = 0;
      let particles = [];   // 金箔の粒子
      let ripples = [];     // 波紋
      let autoInterval = null;
      let animationId = null;
      
      // ===== 金箔の粒子 =====
      class GoldParticle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.size = 2 + Math.random() * 5;
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.speedY = (Math.random() - 0.5) * 0.2 - 0.1;
          this.opacity = 0.3 + Math.random() * 0.5;
          this.rotation = Math.random() * Math.PI * 2;
          this.rotSpeed = (Math.random() - 0.5) * 0.02;
        }
        
        update(w, h) {
          this.x += this.speedX;
          this.y += this.speedY;
          this.rotation += this.rotSpeed;
          
          // 画面外に出たらリセット
          if(this.x < -20) this.x = w + 20;
          if(this.x > w + 20) this.x = -20;
          if(this.y < -20) this.y = h + 20;
          if(this.y > h + 20) this.y = -20;
        }
        
        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.globalAlpha = this.opacity;
          ctx.fillStyle = '#86cdb1';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#86cdb1';
          
          // 不規則な金箔の形
          ctx.beginPath();
          for(let i = 0; i < 4; i++) {
            const angle = (i * Math.PI * 2 / 4) + Math.sin(Date.now() * 0.001) * 0.3;
            const rad = this.size * (0.7 + Math.sin(angle * 3) * 0.2);
            const x = Math.cos(angle) * rad;
            const y = Math.sin(angle) * rad;
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }
      
      // ===== 波紋クラス =====
      class Ripple {
        constructor(x, y, maxRadius = 70) {
          this.x = x;
          this.y = y;
          this.radius = 3;
          this.maxRadius = maxRadius;
          this.opacity = 0.5;
          this.lineWidth = 2;
          this.speed = 1.1;
        }
        
        update() {
          this.radius += this.speed;
          this.opacity -= 0.008;
          this.lineWidth -= 0.03;
          return this.radius < this.maxRadius && this.opacity > 0;
        }
        
        draw(ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(134, 205, 177, ${this.opacity * 0.6})`;
          ctx.lineWidth = Math.max(0.3, this.lineWidth);
          ctx.stroke();
          
          if(this.radius > 12) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(134, 205, 177, ${this.opacity * 0.3})`;
            ctx.lineWidth = Math.max(0.2, this.lineWidth * 0.6);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      
      function addParticle(x, y) {
        particles.push(new GoldParticle(x, y));
        // 多くなりすぎないように
        if(particles.length > 80) particles = particles.slice(-70);
      }
      
      function addRipple(x, y) {
        ripples.push(new Ripple(x, y, 45 + Math.random() * 40));
        if(Math.random() < 0.2) {
          ripples.push(new Ripple(x - 4 + Math.random() * 8, y - 4 + Math.random() * 8, 35));
        }
      }
      
      // 粒子を自動補充
      function autoGenerate() {
        if(!width || !height) return;
        
        // 粒子の数が少なければ追加
        if(particles.length < 30) {
          for(let i = 0; i < 3; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            addParticle(x, y);
          }
        }
        
        // 波紋を時々
        if(Math.random() < 0.3) {
          const x = 20 + Math.random() * (width - 40);
          const y = 30 + Math.random() * (height - 60);
          addRipple(x, y);
        }
      }
      
      // マウス/タッチで波紋＋粒子
      function onPointerMove(e) {
        if(!width || !height) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        if(e.touches) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        
        let x = (clientX - rect.left) * scaleX;
        let y = (clientY - rect.top) * scaleY;
        
        if(x > 0 && x < width && y > 0 && y < height) {
          addRipple(x, y);
          // 触れた場所に金箔の粒子を舞わせる
          for(let i = 0; i < 2; i++) {
            addParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
          }
        }
      }
      
      function updateAndDraw() {
        if(!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        // 粒子の更新と描画
        for(let i = 0; i < particles.length; i++) {
          particles[i].update(width, height);
          particles[i].draw(ctx);
        }
        
        // 波紋の更新と描画
        for(let i = ripples.length-1; i >= 0; i--) {
          const alive = ripples[i].update();
          if(alive) {
            ripples[i].draw(ctx);
          } else {
            ripples.splice(i,1);
          }
        }
      }
      
      function resizeCanvas() {
        const hero = document.querySelector('.hero');
        if(!hero) return;
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;
        
        // リセット
        particles = [];
        ripples = [];
        
        // 初期の金箔粒子（30〜40個）
        const particleCount = 30 + Math.floor(Math.random() * 20);
        for(let i = 0; i < particleCount; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          particles.push(new GoldParticle(x, y));
        }
        
        // 初期の波紋
        for(let i = 0; i < 3; i++) {
          setTimeout(() => {
            if(width && height) {
              addRipple(Math.random() * width, Math.random() * height);
            }
          }, i * 300);
        }
      }
      
      function animate() {
        updateAndDraw();
        animationId = requestAnimationFrame(animate);
      }
      
      function init() {
        resizeCanvas();
        animate();
        
        if(autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(autoGenerate, 2000);
        
        canvas.addEventListener('mousemove', onPointerMove);
        canvas.addEventListener('touchmove', onPointerMove, { passive: false });
        canvas.addEventListener('touchstart', onPointerMove, { passive: false });
        window.addEventListener('resize', () => setTimeout(resizeCanvas, 150));
      }
      
      if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      
      window.addEventListener('beforeunload', () => {
        if(autoInterval) clearInterval(autoInterval);
        if(animationId) cancelAnimationFrame(animationId);
      });
    })();
