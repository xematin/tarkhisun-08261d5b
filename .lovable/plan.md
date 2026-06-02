## Goal
Reposition the 12 port markers on `PortsMapSection.tsx` so each one sits exactly on its real geographic location on the Iran SVG shape, matching the reference image you sent.

## Approach

1. **Determine the SVG's geographic bounding box.** The `public/iran-map.svg` is a traced silhouette rendered as a CSS mask in a square container. I'll inspect the SVG path to find its real bounding box (minX/maxX/minY/maxY in SVG units), then map that box to Iran's real geographic extent:
   - Longitude: ~44.0°E (west, Khorramshahr area) → ~63.3°E (east, near Chabahar/Sistan border)
   - Latitude: ~25.07°N (south, Chabahar coast) → ~39.78°N (north, Astara/Armenia border)

2. **Convert each port's real lat/lng (from your reference image) into x%/y%** on the square container using a linear projection:
   - `x% = (lng - minLng) / (maxLng - minLng) * 100`
   - `y% = (maxLat - lat) / (maxLat - minLat) * 100`

   Source coordinates (from your image):
   ```
   آستارا        37.4300 N, 48.8711 E
   انزلی          37.4697 N, 49.4584 E
   سرخس         36.5403 N, 61.1570 E
   باشماق/باجماق 37.1197 N, 57.3086 E (note: image label may be off — باشماق is Kurdistan ~35.66 N, 46.06 E; I'll use the real باشماق coordinates, not the image's mistaken value)
   ماهیرود        36.3111 N, 61.7908 E (image value is off — real ماهیرود is ~32.66 N, 60.05 E; I'll use real)
   خرمشهر        30.4275 N, 48.1753 E
   امام خمینی    30.3631 N, 49.5931 E
   بوشهر          28.9647 N, 50.8371 E
   شهید رجایی   27.1463 N, 56.2625 E
   سیریک          25.4589 N, 57.4647 E (real ~26.51 N, 57.04 E — will use real)
   جاسک           25.6425 N, 57.7628 E (real ~25.65 N, 57.77 E — matches)
   چابهار          25.2910 N, 60.6218 E
   ```
   I'll use the **real-world coordinates** from authoritative sources rather than the slightly-off values in the image, so markers sit precisely on the correct points of the Iran shape.

3. **Update labelSide for each port** so labels don't overlap or cover the country shape (top/bottom/left/right based on each port's position).

4. **Verify with screenshots.** After the change, I'll:
   - Take a desktop screenshot of the `#ports` section
   - Crop/zoom into the map area
   - Visually confirm each dot sits on the correct part of the Iran outline (north dots on north coast, west dots on Iraq border, south dots on Persian Gulf/Oman Sea coast, east dots on the Afghan/Pakistan border)
   - If any marker is off by more than ~1-2%, adjust and re-screenshot until correct

## Files to change
- `src/components/PortsMapSection.tsx` — update `ports` array with recomputed `x`, `y`, and `labelSide`

## Out of scope
- No changes to the rotating ports list in `HeroSection.tsx`
- No changes to the SVG asset itself
- No changes to label styling / dot styling

## Note on the reference image
The image you uploaded has some coordinate values that don't match the real-world location of the named port (e.g. باشماق label shows 37.11 N / 57.30 E which is in Khorasan, not Kurdistan; ماهیرود shows 36.31 N which is too far north). I'll prioritize **placing each named port at its true geographic location on the Iran shape**, since that's what looks correct visually. Let me know if you'd rather I use the exact numeric values from the image even where they don't match the real port location.
