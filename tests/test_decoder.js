"use strict";
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");
const source = fs.readFileSync(require("path").join(__dirname, "../dnx_airmarine_3d/dnx_airmarine_3d.js"), "utf8");
const window = { __DNX_AIRMARINE_TEST__: true, location: { href: "https://receiver.example/" } };
let fetchImpl = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ query: { pages: [] } }) });
const testContext = {
  window, console, Date, Math, Number, String, Object, Array, Uint8Array, ArrayBuffer,
  URL, URLSearchParams, Promise, isFinite, parseInt, setTimeout, clearTimeout,
  fetch: (url, options) => fetchImpl(url, options)
};
vm.runInNewContext(source, testContext);
const api = window.__DNX_AIRMARINE_TEST_API__;
assert(api, "test API initialized");
assert.strictEqual(api.aisModelKind({ shipType: 70 }), "cargo");
assert.strictEqual(api.aisModelKind({ shipType: 80 }), "tanker");
assert.strictEqual(api.aisModelKind({ shipType: 60 }), "passenger");
assert.strictEqual(api.aisModelKind({ shipType: 52 }), "tug");
assert.strictEqual(api.aisModelKind({ shipType: 30 }), "fishing");
assert.strictEqual(api.aisFocusHeight({ kindName: "cargo", lengthM: 180 }), 18000);
assert.strictEqual(api.aisFocusHeight({ kindName: "tug", lengthM: 30 }), 16000);
assert.strictEqual(api.aisFocusHeight({ kindName: "tanker", lengthM: 600 }), 42000);
assert.strictEqual(api.aisModelAssetKey({ shipType: 70, name: "TFCC BULK CARRIER", lengthM: 180 }), "bulk");
assert.strictEqual(api.aisModelAssetKey({ shipType: 70, name: "DNX CONTAINER", lengthM: 180 }), "container");
assert.strictEqual(api.aisModelAssetKey({ shipType: 80, name: "LNG GAS CARRIER", lengthM: 210 }), "lng");
assert.strictEqual(api.aisModelAssetKey({ shipType: 60, name: "DNX CRUISE", lengthM: 220 }), "cruise");
assert.strictEqual(api.aisModelAssetKey({ shipType: 60, name: "DNX FERRY", lengthM: 120 }), "ferry");
assert.strictEqual(api.aisModelAssetKey({ shipType: 60, name: "DNX FERRY", lengthM: 45 }), "ferry_small");
assert.strictEqual(api.aisModelAssetKey({ shipType: 40, name: "FAST CAT", lengthM: 48 }), "ferry_small");
assert.strictEqual(api.aisModelAssetKey({ shipType: 37, name: "SMALL YACHT", lengthM: 8 }), "runabout");
assert.strictEqual(api.aisModelAssetKey({ shipType: 35, name: "PATROL VESSEL", lengthM: 54 }), "navy");
assert.strictEqual(api.aisModelAssetKey({ shipType: 33, name: "DREDGER", lengthM: 105 }), "tug");
assert.strictEqual(api.aisModelAssetKey({ shipType: 0, name: "", lengthM: 160 }), "container");
assert.strictEqual(api.aisModelAssetKey({ isAid: true, shipType: 70, lengthM: 100 }), null);
assert.deepStrictEqual(JSON.parse(JSON.stringify(api.aisShipDimensions({ kindName: "cargo", lengthM: 4, beamM: 12 }))),
  { length: 12, beam: 4, kind: "cargo" }, "bad AIS length/beam values should be swapped");
assert.deepStrictEqual(JSON.parse(JSON.stringify(api.aisShipDimensions({ kindName: "tanker", lengthM: 600, beamM: 100 }))),
  { length: 460, beam: 70, kind: "tanker" }, "AIS dimensions should be bounded for camera/model stability");
assert.strictEqual(api.shortestAngleDelta(359, 1), 2);
assert.strictEqual(api.shortestAngleDelta(1, 359), -2);
const aisHeading = { cogDeg: 359, headingDeg: 355 };
assert.strictEqual(api.followVisualHeading(aisHeading, 6), 5,
  "the visual-only ship offset should wrap without overwriting the AIS course");
assert.strictEqual(aisHeading.cogDeg, 359, "the model offset must not mutate AIS data");
assert.strictEqual(api.followVisualHeading({ cogDeg: 10 }, 0), 10,
  "resetting the visual model offset should restore the AIS course");
const behind = api.followCameraLocal(0, 0, 0, 100, 5);
assert(Math.abs(behind.east) < 1e-9 && Math.abs(behind.north + 100) < 1e-9 && behind.up === 5,
  "zero yaw must place the camera astern without changing AIS heading");
const starboard = api.followCameraLocal(0, 90, 0, 100, 5);
assert(Math.abs(starboard.east - 100) < 1e-9 && Math.abs(starboard.north) < 1e-9,
  "a 90-degree camera yaw must orbit to the ship's side");

const exactShipPhoto = {
  title: "File:RMS Queen Mary 2, River Mersey.jpg",
  fullurl: "https://commons.wikimedia.org/wiki/File:RMS_Queen_Mary_2_River_Mersey.jpg",
  imageinfo: [{
    thumburl: "https://upload.wikimedia.org/wikipedia/commons/thumb/q/q1/Queen_Mary_2.jpg/720px-Queen_Mary_2.jpg",
    mime: "image/jpeg",
    extmetadata: {
      ImageDescription: { value: "RMS Queen Mary 2 at the River Mersey" },
      Artist: { value: "<a>Example photographer</a>" },
      LicenseShortName: { value: "CC BY-SA 4.0" }
    }
  }]
};
assert(api.exactShipPhotoScore(exactShipPhoto, { name: "Queen Mary 2", mmsi: "123456789" }) > 0,
  "an exact vessel-name match should be selected as a ship photo");
const modelShipPhoto = JSON.parse(JSON.stringify(exactShipPhoto));
modelShipPhoto.title = "File:Queen Mary 2 scale model.jpg";
modelShipPhoto.imageinfo[0].extmetadata.ImageDescription.value = "A scale model of Queen Mary 2";
assert.strictEqual(api.exactShipPhotoScore(modelShipPhoto, { name: "Queen Mary 2" }), -1,
  "a miniature/model photo must not be presented as the real vessel");
const representativeCargoPhoto = JSON.parse(JSON.stringify(exactShipPhoto));
representativeCargoPhoto.title = "File:Container ship at sea.jpg";
representativeCargoPhoto.imageinfo[0].extmetadata.ImageDescription.value = "A container ship at sea";
assert.strictEqual(api.exactShipPhotoScore(representativeCargoPhoto, { name: "DNX Test Cargo" }), -1);
assert(api.typeShipPhotoScore(representativeCargoPhoto, "cargo") > 0,
  "a type-only image must be recognized as an illustrative fallback");
assert.strictEqual(
  Array.from(api.exactShipPhotoQueries({ name: "Queen Mary 2", imo: "9210022", mmsi: "123456789" })).join("|"),
  '"9210022"|"queen mary 2"|"123456789"',
  "exact lookup should try IMO, then vessel name, then MMSI"
);

async function testExactPhotoSearchFallback() {
  const searches = [];
  fetchImpl = (url) => {
    const query = new URL(url).searchParams.get("gsrsearch");
    searches.push(query);
    const pages = query === '"queen mary 2"' ? [exactShipPhoto] : [];
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ query: { pages } })
    });
  };
  const photo = await api.getShipPhoto({
    name: "Queen Mary 2", imo: "9210022", mmsi: "123456789", kindName: "passenger"
  });
  assert(photo && photo.match === "exact", "name lookup should recover when the IMO search has no result");
  assert.strictEqual(searches.join("|"), '"9210022"|"queen mary 2"',
    "successful name lookup should stop before the MMSI/type searches");
}

function put(bits, start, length, value) {
  let n = BigInt(value);
  if (n < 0n) n = (1n << BigInt(length)) + n;
  let s = n.toString(2).padStart(length, "0");
  assert.strictEqual(s.length, length, `field overflow at ${start}`);
  for (let i = 0; i < length; i++) bits[start + i] = s[i];
}
function armor(bits) {
  let padded = bits.slice();
  while (padded.length % 6) padded.push("0");
  const fill = padded.length - bits.length;
  let payload = "";
  for (let i = 0; i < padded.length; i += 6) {
    const value = parseInt(padded.slice(i, i + 6).join(""), 2);
    payload += String.fromCharCode(value < 40 ? value + 48 : value + 56);
  }
  return { payload, fill };
}
function nmea(payload, fill, total = 1, number = 1, sequence = "", channel = "A") {
  const body = `AIVDM,${total},${number},${sequence},${channel},${payload},${fill}`;
  let checksum = 0;
  for (const ch of body) checksum ^= ch.charCodeAt(0);
  return `!${body}*${checksum.toString(16).toUpperCase().padStart(2, "0")}`;
}
function hexFromBits(bits) {
  const padded = bits.slice();
  while (padded.length % 8) padded.push("0");
  let hex = "";
  for (let i = 0; i < padded.length; i += 8) hex += parseInt(padded.slice(i, i + 8).join(""), 2).toString(16).padStart(2, "0");
  return hex.toUpperCase();
}

// Class A position report: MMSI 244660959 near the Lower Rhine.
const posBits = Array(168).fill("0");
put(posBits, 0, 6, 1);
put(posBits, 8, 30, 244660959);
put(posBits, 38, 4, 0);
put(posBits, 50, 10, 123);       // 12.3 kn
put(posBits, 61, 28, Math.round(6.859 * 600000));
put(posBits, 89, 27, Math.round(51.843 * 600000));
put(posBits, 116, 12, 2700);     // 270.0 degrees
put(posBits, 128, 9, 271);
const posEncoded = armor(posBits);
const parsedPos = api.parseAisSentence(nmea(posEncoded.payload, posEncoded.fill));
assert.strictEqual(parsedPos.aisType, 1);
assert.strictEqual(parsedPos.mmsi, "244660959");
assert(Math.abs(parsedPos.lat - 51.843) < 0.00001);
assert(Math.abs(parsedPos.lon - 6.859) < 0.00001);
assert.strictEqual(parsedPos.sogKn, 12.3);
assert.strictEqual(parsedPos.cogDeg, 270);

// The same packed bits path used by OpenWebRX parseNmea().
const parsedPacked = api.parseAisPackedHex(hexFromBits(posBits));
assert.strictEqual(parsedPacked.mmsi, "244660959");
assert(Math.abs(parsedPacked.lat - 51.843) < 0.00001);

// Static/voyage type 5 report, including name, ship type and dimensions.
const staticBits = Array(424).fill("0");
put(staticBits, 0, 6, 5);
put(staticBits, 8, 30, 244660959);
function putText(bits, start, length, text) {
  const alphabet = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ !\"#$%&'()*+,-./0123456789:;<=>?";
  const padded = String(text).padEnd(length / 6, "@").slice(0, length / 6);
  for (let i = 0; i < padded.length; i++) put(bits, start + 6 * i, 6, alphabet.indexOf(padded[i]));
}
putText(staticBits, 70, 42, "PCDNX");
putText(staticBits, 112, 120, "DNX TEST CARGO");
put(staticBits, 40, 30, 1234567);
put(staticBits, 232, 8, 70);
put(staticBits, 240, 9, 120);
put(staticBits, 249, 9, 40);
put(staticBits, 258, 6, 10);
put(staticBits, 264, 6, 10);
put(staticBits, 274, 4, 10);   // October
put(staticBits, 278, 5, 23);
put(staticBits, 283, 5, 18);
put(staticBits, 288, 6, 45);
put(staticBits, 294, 8, 92);   // 9.2 m draught
putText(staticBits, 302, 120, "ROTTERDAM");
const staticEncoded = armor(staticBits);
const fragments = staticEncoded.payload;
const first = api.parseAisSentence(nmea(fragments.slice(0, 40), 0, 2, 1, "3", "A"), { source: "AIS", freq: "162000000" });
assert.strictEqual(first, null, "first fragment should be buffered");
const second = api.parseAisSentence(nmea(fragments.slice(40), staticEncoded.fill, 2, 2, "3", "A"), { source: "AIS", freq: "162000000" });
assert.strictEqual(second.aisType, 5);
assert.strictEqual(second.name, "DNX TEST CARGO");
assert.strictEqual(second.shipType, 70);
assert.strictEqual(second.lengthM, 160);
assert.strictEqual(second.beamM, 20);
assert.strictEqual(second.imo, 1234567);
assert.strictEqual(second.destination, "ROTTERDAM");
assert.strictEqual(second.draughtM, 9.2);
assert.deepStrictEqual(JSON.parse(JSON.stringify(second.eta)), { month: 10, day: 23, hour: 18, minute: 45 });
assert.strictEqual(second.source, "AIS");
assert.strictEqual(second.freq, "162000000");

// AIS type 18 Class B position report.
const bBits = Array(168).fill("0");
put(bBits, 0, 6, 18);
put(bBits, 8, 30, 244660959);
put(bBits, 46, 10, 55);
put(bBits, 57, 28, Math.round(7.123 * 600000));
put(bBits, 85, 27, Math.round(52.456 * 600000));
put(bBits, 112, 12, 1234);
put(bBits, 124, 9, 124);
const bEncoded = armor(bBits);
const parsedB = api.parseAisSentence(nmea(bEncoded.payload, bEncoded.fill));
assert.strictEqual(parsedB.aisType, 18);
assert.strictEqual(parsedB.sogKn, 5.5);
assert(Math.abs(parsedB.lat - 52.456) < 0.00001);
assert(Math.abs(parsedB.lon - 7.123) < 0.00001);

// Full message ingestion path: NMEA wrapped in the OpenWebRX APRS data field.
const api2Window = { __DNX_AIRMARINE_TEST__: true };
const api2Context = { window: api2Window, console, Date, Math, Number, String, Object, Array, Uint8Array, ArrayBuffer, isFinite, parseInt, setTimeout, clearTimeout };
vm.runInNewContext(source, api2Context);
const api2 = api2Window.__DNX_AIRMARINE_TEST_API__;
const firstFragmentSentence = nmea(fragments.slice(0, 40), 0, 2, 1, "3", "A");
const firstFragmentBits = api2.armorToBits(fragments.slice(0, 40));
assert.strictEqual(api2.ingestAis({
  mode: "AIS", type: "nmea", nmea_type: "AIVDM",
  data: "{DA" + firstFragmentSentence,
  message: hexFromBits(firstFragmentBits.split(""))
}), null, "a partial NMEA fragment must not be mistaken for a complete message");
assert.strictEqual(Object.keys(api2.records.ais).length, 0);
const staticRecord = api2.ingestAis({
  mode: "AIS", type: "nmea", nmea_type: "AIVDM",
  data: "{DA" + nmea(staticEncoded.payload, staticEncoded.fill),
  message: hexFromBits(staticBits)
});
assert(staticRecord);
assert.strictEqual(staticRecord.imo, "1234567");
assert.strictEqual(staticRecord.destination, "ROTTERDAM");
assert.strictEqual(staticRecord.draughtM, 9.2);
const record = api2.ingestAis({
  mode: "AIS", type: "nmea", nmea_type: "AIVDM",
  data: "{DA" + nmea(posEncoded.payload, posEncoded.fill),
  message: hexFromBits(posBits)
});
assert(record);
assert.strictEqual(record.mmsi, "244660959");
assert(Math.abs(record.lat - 51.843) < 0.00001);

// ADS-B snapshot path mirrors AdsbMessagePanel's ADSB-LIST messages.
const count = api2.ingestAdsb({ mode: "ADSB-LIST", aircraft: [
  { icao: "abc123", flight: "DNX123", lat: 51.7, lon: 6.9, altitude: 12000, altitude_geom: 12100,
    nav_altitude_mcp: 13000, speed: 210, course: 83, baro_rate: -500, messages: 1000,
    rssi: -12.5, seen: 0.4, seen_pos: 0.3, category: "A3", source: "ADS-B", frequency: "1090 MHz" }
] });
assert.strictEqual(count, 1);
const aircraft = api2.records.adsb.ABC123;
assert(aircraft);
assert.strictEqual(aircraft.flight, "DNX123");
assert.strictEqual(aircraft.altitudeFt, 12000);
assert(Math.abs(aircraft.altitudeM - 3657.6) < 0.01);
assert.strictEqual(aircraft.courseDeg, 83);
assert.strictEqual(aircraft.geomAltitudeFt, 12100);
assert.strictEqual(aircraft.navAltitudeFt, 13000);
assert.strictEqual(aircraft.vspeedFpm, -500);
assert.strictEqual(aircraft.messageCount, 1000);
assert.strictEqual(aircraft.rssi, -12.5);
assert.strictEqual(aircraft.seenSec, 0.4);
assert.strictEqual(aircraft.seenPosSec, 0.3);
assert.strictEqual(aircraft.category, "A3");
assert.strictEqual(aircraft.source, "ADS-B");
assert.strictEqual(aircraft.freq, "1090 MHz");
assert.strictEqual(aircraft.lat, 51.7);

testExactPhotoSearchFallback().then(() => {
  console.log("PASS: AIS/ADS-B data paths, ship asset mapping and size bounds, camera-orbit geometry, photo search, and close-up zoom bounds");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
