import HeatmapData from '@/models/HeatmapData'

export function generateHeatmapScript(projectId: string) {
  return `
    (function() {
      let events = [];
      const projectId = '${projectId}';
      const sessionId = Math.random().toString(36).substring(7);
      
      function trackEvent(type, x, y, element) {
        events.push({
          type,
          x,
          y,
          element: element.tagName + (element.id ? '#' + element.id : '') + (element.className ? '.' + element.className.split(' ')[0] : ''),
          timestamp: new Date()
        });
        
        if (events.length >= 10) {
          sendEvents();
        }
      }
      
      function sendEvents() {
        if (events.length === 0) return;
        
        fetch('/api/heatmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            sessionId,
            events: events.splice(0),
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            userAgent: navigator.userAgent
          })
        }).catch(console.error);
      }
      
      document.addEventListener('click', (e) => {
        trackEvent('click', e.clientX, e.clientY, e.target);
      });
      
      document.addEventListener('scroll', () => {
        trackEvent('scroll', 0, window.scrollY, document.body);
      });
      
      setInterval(sendEvents, 30000);
      window.addEventListener('beforeunload', sendEvents);
    })();
  `
}

export async function generateHeatmapVisualization(projectId: string, timeRange: string = '7d') {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30))
    
    const data = await HeatmapData.find({
      projectId,
      createdAt: { $gte: startDate }
    })
    
    const clickMap = new Map()
    
    data.forEach(session => {
      session.events.forEach(event => {
        if (event.type === 'click') {
          const key = `${Math.floor(event.x / 10)}-${Math.floor(event.y / 10)}`
          clickMap.set(key, (clickMap.get(key) || 0) + 1)
        }
      })
    })
    
    return Array.from(clickMap.entries()).map(([key, count]) => {
      const [x, y] = key.split('-').map(Number)
      return { x: x * 10, y: y * 10, intensity: count }
    })
  } catch (error) {
    console.error('Heatmap generation error:', error)
    return []
  }
}