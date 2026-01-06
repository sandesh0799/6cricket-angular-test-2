function checkCameras(distRange, lightRange, cams) {
  const pts = [distRange.min, distRange.max];

  for (const c of cams) {
    if (c.distance.max > distRange.min && c.distance.min < distRange.max) {
      pts.push(Math.max(c.distance.min, distRange.min));
      pts.push(Math.min(c.distance.max, distRange.max));
    }
  }

  pts.sort((a, b) => a - b);

  for (let i = 0; i < pts.length - 1; i++) {
    const d1 = pts[i];
    const d2 = pts[i + 1];

    if (d1 === d2) continue;

    const validCams = cams.filter(c => c.distance.min <= d1 && c.distance.max >= d2);

    if (!checkLight(lightRange, validCams)) return false;
  }

  return true;
}

function checkLight(wantedLight, cams) {
  const parts = [];

  for (const c of cams) {
    const lo = Math.max(c.light.min, wantedLight.min);
    const hi = Math.min(c.light.max, wantedLight.max);
    if (lo < hi) parts.push({ lo, hi });
  }

  if (!parts.length) return false;

  parts.sort((a, b) => a.lo - b.lo);

  let curr = wantedLight.min;

  for (const p of parts) {
    if (p.lo > curr) return false;
    curr = Math.max(curr, p.hi);
    if (curr >= wantedLight.max) return true;
  }

  return false;
}

const distRange = { min: 1, max: 10 };
const lightRange = { min: 100, max: 1000 };

const cams = [
  { distance: { min: 1, max: 4 }, light: { min: 100, max: 500 } },
  { distance: { min: 4, max: 7 }, light: { min: 300, max: 800 } },
  { distance: { min: 7, max: 10 }, light: { min: 600, max: 1000 } }
];

console.log(checkCameras(distRange, lightRange, cams));