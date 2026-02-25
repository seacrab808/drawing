import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import './DrawingCanvas.css';

const COLORS = [
  '#000000', '#5c4a32', '#8b4513', '#2d7d4a', '#1e5a8a', '#6b2d5c', '#a04444', '#c4a574',
  '#ffffff', '#f5e6d3', '#ffd700', '#87ceeb', '#98fb98', '#ffb6c1', '#dda0dd', '#f0e68c',
];

const TOOLS = [
  { id: 'pen', label: '펜', lineWidth: 2, globalAlpha: 1 },
  { id: 'highlighter', label: '형광펜', lineWidth: 12, globalAlpha: 0.4 },
  { id: 'eraser', label: '지우개', lineWidth: 20, globalAlpha: 1, isEraser: true },
];

export default function DrawingCanvas() {
  const { dateStr } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [ready, setReady] = useState(false);
  const prevState = location.state || {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.min(rect.width, 700);
    const h = Math.min(rect.height, 500);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fffef9';
    ctx.fillRect(0, 0, w, h);
    if (prevState.drawingData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
      };
      img.src = prevState.drawingData;
    }
    setReady(true);
  }, []);

  const getToolConfig = () => {
    const t = TOOLS.find((x) => x.id === tool) || TOOLS[0];
    return t;
  };

  const startDraw = (e) => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const config = getToolConfig();
    ctx.globalAlpha = config.globalAlpha;
    if (config.isEraser) {
      ctx.strokeStyle = '#fffef9';
      ctx.lineWidth = config.lineWidth;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = config.lineWidth;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const moveDraw = (e) => {
    if (!isDrawing || !ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    navigate(`/diary/write/${dateStr}`, {
      replace: false,
      state: {
        ...prevState,
        drawingData: dataUrl,
      },
    });
  };

  return (
    <>
      <TopBar title="그림 그리기" showBack />
      <main className="drawing-canvas-page page-grid-bg">
        <div className="drawing-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>
        <div className="drawing-palette">
          <p className="drawing-palette-label">색 선택</p>
          <div className="drawing-palette-colors">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`drawing-palette-swatch ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`색 ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="drawing-tools">
          <p className="drawing-tools-label">도구</p>
          <div className="drawing-tools-btns">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`drawing-tool-btn ${tool === t.id ? 'active' : ''}`}
                onClick={() => setTool(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="drawing-done" onClick={handleDone}>
          그리기 완료
        </button>
      </main>
    </>
  );
}
