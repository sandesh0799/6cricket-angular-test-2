function camerasSuffice(desiredDistance, desiredLight, cameras) {
    const points = new Set();
    points.add(desiredDistance.min);
    points.add(desiredDistance.max);
  
    for (const cam of cameras) {
      if (
        cam.distance.max > desiredDistance.min &&
        cam.distance.min < desiredDistance.max
      ) {
        points.add(Math.max(cam.distance.min, desiredDistance.min));
        points.add(Math.min(cam.distance.max, desiredDistance.max));
      }
    }
  
    const sortedPoints = Array.from(points).sort((a, b) => a - b);
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const sliceStart = sortedPoints[i];
      const sliceEnd = sortedPoints[i + 1];
  
      if (sliceStart === sliceEnd) continue;
      const validCameras = cameras.filter(cam =>
        cam.distance.min <= sliceStart &&
        cam.distance.max >= sliceEnd
      );
  
      if (!lightCovered(desiredLight, validCameras)) {
        return false;
      }
    }
  
    return true;
  }

  function lightCovered(desiredLight, cameras) {
    const intervals = cameras
      .map(cam => ({
        min: Math.max(cam.light.min, desiredLight.min),
        max: Math.min(cam.light.max, desiredLight.max)
      }))
      .filter(r => r.min < r.max)
      .sort((a, b) => a.min - b.min);
  
    if (intervals.length === 0) return false;
  
    let coveredUntil = desiredLight.min;
  
    for (const interval of intervals) {
      if (interval.min > coveredUntil) {
        return false; 
      }
      coveredUntil = Math.max(coveredUntil, interval.max);
      if (coveredUntil >= desiredLight.max) {
        return true;
      }
    }
  
    return false;
  }
  
  /* -------------------- Example Usage -------------------- */
  
  const desiredDistance = { min: 1, max: 10 };
  const desiredLight = { min: 100, max: 1000 };
  
  const hardwareCameras = [
    { distance: { min: 1, max: 4 },  light: { min: 100, max: 500 } },
    { distance: { min: 4, max: 7 },  light: { min: 300, max: 800 } },
    { distance: { min: 7, max: 10 }, light: { min: 600, max: 1000 } }
  ];
  
  console.log(
    camerasSuffice(desiredDistance, desiredLight, hardwareCameras)
  );
  