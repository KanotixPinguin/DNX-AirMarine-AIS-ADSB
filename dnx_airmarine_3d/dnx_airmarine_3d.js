/* DNX Air/Marine 3D v4.13
 * Frontend-only OpenWebRX supplement: passively taps the existing message panels.
 * No extra receiver, profile, WebSocket, iframe, RX ID, or server decoder is created.
 */
(function () {
  "use strict";

  if (window.__dnxAirMarine3DInstalled) return;
  window.__dnxAirMarine3DInstalled = true;

  var VERSION = "4.54";
  var APP_ROOT = "/static/plugins/receiver/dnx_airmarine_3d";
  var CESIUM_ROOT = "/static/plugins/receiver/dnx_weather/vendor/cesium/";
  var CESIUM_JS = CESIUM_ROOT + "Cesium.js";
  var CESIUM_CSS = CESIUM_ROOT + "Widgets/widgets.css";
  var LEAFLET_ROOT = "/static/plugins/receiver/dnx_weather/vendor/leaflet/";
  var LEAFLET_JS = LEAFLET_ROOT + "leaflet.js";
  var LEAFLET_CSS = LEAFLET_ROOT + "leaflet.css";
  var AIRCRAFT_MODEL = APP_ROOT + "/models/aircraft/Cesium_Air.glb";
  /* Supply a restricted ArcGIS Location Platform API key through this public config hook.
   * Never place an ArcGIS account password or private credential in the browser. */
  var ESRI_TOKEN = safeText(window.DNX_AIRMARINE_ESRI_TOKEN || "");
  var BASEMAPS = {
    osm: { label: "OpenStreetMap", url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", maxZoom: 19, credit: "osm" },
    satellite: { label: "Satellit", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", maxZoom: 19, credit: "esri" },
    satlabels: {
      label: "Satellit + Orte",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      overlay: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      overlayAlpha: 0.9, maxZoom: 19, credit: "esri", overlayCredit: "esri"
    },
    topo: { label: "OpenTopoMap", url: "https://tile.opentopomap.org/{z}/{x}/{y}.png", maxZoom: 17, credit: "topo" },
    street: { label: "Esri Straßen", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", maxZoom: 19, credit: "esri" },
    dark: { label: "Dark · CARTO", url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", maxZoom: 19, credit: "carto" },
    nautical: { label: "Nautik · OSM + OpenSeaMap", url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", overlay: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", overlayAlpha: 0.9, maxZoom: 18, credit: "osm", overlayCredit: "seamark" }
  };
  function baseMapAvailable(choice) { return !!BASEMAPS[choice]; }
  function baseMapTileUrl(choice) {
    var cfg = BASEMAPS[choice] || BASEMAPS.osm;
    /* Optional premium endpoint when a restricted ArcGIS token is configured. */
    if (choice === "satellite" && ESRI_TOKEN) {
      return "https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=" + encodeURIComponent(ESRI_TOKEN);
    }
    return cfg.url;
  }

  /* Existing receiver-local models remain the emergency fallback if a new CC BY asset cannot load. */
  var AIS_MODELS = {
    cargo: "cargo", tanker: "tanker", passenger: "passenger",
    tug: "tug", fishing: "fishing", sail: "sail",
    dredger: "dredger", hsc: "hsc", pilot: "pilot",
    sar: "sar", patrol: "patrol", yacht: "yacht", generic: "generic"
  };
  var AIS_REALISTIC_MODEL_FILES = {
    container: "ship-container.glb", tanker: "ship-tanker.glb", lng: "ship-lng.glb",
    bulk: "ship-bulk.glb", cruise: "ship-cruise.glb", ferry_small: "ship-ferry_small.glb",
    ferry: "ship-ferry.glb", navy: "ship-navy.glb", pilot: "ship-pilot.glb",
    sail: "ship-sail.glb", yacht: "ship-yacht.glb", runabout: "ship-runabout.glb",
    tug: "ship-tug.glb", fishing: "ship-fishing.glb"
  };
  var AIRCRAFT_REALISTIC_MODEL_FILES = {
    bb_a319: "bluebell-neutral/details-v444/A319.glb", bb_a320: "bluebell-neutral/details-v444/A320.glb", bb_a321: "bluebell-neutral/details-v444/A321.glb", bb_a333: "bluebell-neutral/details-v444/A333.glb", bb_a388: "bluebell-neutral/details-v444/A388.glb", bb_b738: "bluebell-neutral/details-v444/B738.glb", bb_b744: "bluebell-neutral/details-v444/B744.glb", bb_b772: "bluebell-neutral/details-v444/B772.glb",
    a320: "A320_nologo.glb", a350: "A350_nologo.glb", a380: "A380_nologo.glb",
    b737: "B737_nologo.glb", b787: "B787_nologo.glb", evtol: "EVTOL_nologo.glb",
    drone: "classes-v446/drone.glb", helicopter: "classes-v446/helicopter.glb", glider: "classes-v446/glider.glb", f15: "f15.glb",
    single_prop: "classes-v446/single_prop.glb", twin_prop: "classes-v446/twin_prop.glb", balloon: "classes-v446/balloon.glb"
  };
  var AIRCRAFT_MODEL_SCALES = {
    bb_a319: 1, bb_a320: 1, bb_a321: 1, bb_a333: 1, bb_a388: 1, bb_b738: 1, bb_b744: 1, bb_b772: 1,
    a320: 1, a350: 1, a380: 0.42, b737: 1, b787: 1,
    evtol: 5, drone: 1, helicopter: 1, glider: 1, f15: 1, single_prop: 1, twin_prop: 1, balloon: 1
  };
  /* amvlab aircraft are +X-forward; the SDRangel glTFs are +Z-forward. */
  var AIRCRAFT_MODEL_FORWARD_AXES = {
    bb_a319: "Z", bb_a320: "Z", bb_a321: "Z", bb_a333: "Z", bb_a388: "Z", bb_b738: "Z", bb_b744: "Z", bb_b772: "Z",
    a320: "X", a350: "X", a380: "X", b737: "X", b787: "X",
    evtol: "X", drone: "Z", helicopter: "Z", glider: "Z", f15: "Z", single_prop: "Z", twin_prop: "Z", balloon: "Z"
  };
  /* Nominal longest post-transform dimensions (metres), used to set camera range. */
  var AIRCRAFT_MODEL_LENGTHS = {
    bb_a319: 34.042, bb_a320: 37.546, bb_a321: 44.48, bb_a333: 63.532, bb_a388: 79.592, bb_b738: 39.572, bb_b744: 70.18, bb_b772: 64.254,
    a320: 38, a350: 67, a380: 80, b737: 38, b787: 58,
    evtol: 7, drone: 1, helicopter: 20, glider: 17, f15: 22, single_prop: 11, twin_prop: 13, balloon: 14
  };
  var AIS_DEFAULT_BEAM_RATIO = {
    cargo: 0.17, tanker: 0.17, passenger: 0.16, tug: 0.31, fishing: 0.25,
    sail: 0.26, dredger: 0.22, hsc: 0.30, pilot: 0.29, sar: 0.28,
    patrol: 0.20, yacht: 0.25, generic: 0.22
  };
  var MODEL_BASE_LENGTH = {
    cargo: 180, tanker: 190, passenger: 220, tug: 36, fishing: 32,
    sail: 18, dredger: 105, hsc: 48, pilot: 22, sar: 29,
    patrol: 54, yacht: 31, generic: 75
  };
  var AIS_CLASS_LABELS = {
    cargo: "Frachter", tanker: "Tanker", passenger: "Fahrgastschiff", tug: "Schlepper",
    fishing: "Fischerei", sail: "Segelschiff", dredger: "Bagger/Hopper", hsc: "Schnellboot",
    pilot: "Lotsenboot", sar: "SAR/Rettung", patrol: "Patrouille", yacht: "Yacht",
    generic: "Sonstiges Schiff", station: "AIS-Station", aid: "AIS-Seezeichen"
  };
  var COMMONS_API = "https://commons.wikimedia.org/w/api.php";
  var SHIP_PHOTO_CACHE = Object.create(null);
  var PHOTO_TYPE_SEARCH = {
    cargo: "container ship",
    tanker: "oil tanker ship",
    passenger: "passenger cruise ship",
    tug: "harbour tugboat",
    fishing: "fishing trawler",
    sail: "sailing yacht",
    dredger: "dredger ship",
    hsc: "high speed ferry",
    pilot: "pilot boat",
    sar: "search and rescue vessel",
    patrol: "patrol boat",
    yacht: "motor yacht",
    generic: "ship vessel"
  };
  var AIRCRAFT_PHOTO_CACHE = Object.create(null);
  var PHOTO_TYPE_SEARCH_ADSB = {
    a320: "Airbus A320 airliner",
    a350: "Airbus A350 airliner",
    a380: "Airbus A380 airliner",
    b737: "Boeing 737 airliner",
    b787: "Boeing 787 Dreamliner",
    f15: "F-15 Eagle fighter jet",
    glider: "glider sailplane",
    helicopter: "helicopter aircraft",
    evtol: "eVTOL air taxi",
    drone: "quadcopter drone",
    generic: "airliner aircraft"
  };
  var ADSB_TYPE_NAMES = {
    A318: "Airbus A318", A319: "Airbus A319", A320: "Airbus A320", A321: "Airbus A321",
    A20N: "Airbus A320neo", A21N: "Airbus A321neo", A19N: "Airbus A319neo", A20A: "Airbus A320",
    A332: "Airbus A330-200", A333: "Airbus A330-300", A339: "Airbus A330-900",
    A342: "Airbus A340-200", A343: "Airbus A340-300", A346: "Airbus A340-600",
    A359: "Airbus A350-900", A35K: "Airbus A350-1000", A388: "Airbus A380",
    B736: "Boeing 737-600", B737: "Boeing 737-700", B738: "Boeing 737-800", B739: "Boeing 737-900",
    B37M: "Boeing 737 MAX 7", B38M: "Boeing 737 MAX 8", B39M: "Boeing 737 MAX 9",
    B744: "Boeing 747-400", B748: "Boeing 747-8", B752: "Boeing 757-200",
    B762: "Boeing 767-200", B763: "Boeing 767-300", B772: "Boeing 777-200",
    B77L: "Boeing 777-200LR", B77W: "Boeing 777-300ER",
    B788: "Boeing 787-8", B789: "Boeing 787-9", B78X: "Boeing 787-10",
    CRJ2: "Bombardier CRJ200", CRJ7: "Bombardier CRJ700", CRJ9: "Bombardier CRJ900",
    DH8D: "De Havilland Canada Dash 8", E170: "Embraer 170", E190: "Embraer 190",
    E195: "Embraer 195", E75L: "Embraer 175", E75S: "Embraer 175",
    AT45: "ATR 42", AT72: "ATR 72", C172: "Cessna 172", C208: "Cessna 208 Caravan",
    C25A: "Cessna Citation CJ2", C510: "Cessna Citation Mustang", PC12: "Pilatus PC-12",
    BE20: "Beechcraft King Air 200", BE58: "Beechcraft Baron 58", SR22: "Cirrus SR22",
    DA40: "Diamond DA40", DA42: "Diamond DA42", GLEX: "Bombardier Global Express",
    GLF5: "Gulfstream G550", GLF4: "Gulfstream IV", FA20: "Dassault Falcon 20",
    FA50: "Dassault Falcon 50", FA7X: "Dassault Falcon 7X", LJ35: "Learjet 35", LJ45: "Learjet 45",
    EC35: "Eurocopter EC135", AS50: "Eurocopter AS350", S92: "Sikorsky S-92",
    H60: "Sikorsky UH-60 Black Hawk", F15: "F-15 Eagle", F16: "F-16 Fighting Falcon",
    F18: "F/A-18 Hornet", EURO: "Eurofighter Typhoon", A109: "Agusta A109",
    A139: "Agusta AW139", A169: "Agusta AW169"
  };
  var STACK_BASE = 2147483000;
  var stack = 0;
  var RECORDS = { ais: Object.create(null), adsb: Object.create(null) };
  var FRAGMENTS = Object.create(null);
  var WINDOWS = Object.create(null);
  var cesiumPromise = null;
  var leafletPromise = null;
  var statusTimer = null;
  var contextMenu = null;

  var SPECS = {
      adsb: {
      key: "adsb", title: "ADS-B · Flugverkehr", icon: "✈",
      accent: "#3182ce", model: AIRCRAFT_MODEL,
      sourceLabel: "OpenWebRX · aktiver Decoderstrom"
    },
      ais: {
      key: "ais", title: "AIS · Schiffsverkehr", icon: "🚢",
      accent: "#00a884", sourceLabel: "OpenWebRX · aktiver Decoderstrom"
    }
  };

  function byId(id) { return document.getElementById(id); }
  function q(selector, root) { return (root || document).querySelector(selector); }
  function clamp(value, lo, hi) { return Math.max(lo, Math.min(hi, value)); }
  function asNumber() {
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      if (value === null || value === undefined || value === "") continue;
      var n = Number(value);
      if (isFinite(n)) return n;
    }
    return null;
  }
  function validPosition(lat, lon) {
    return lat !== null && lon !== null && isFinite(lat) && isFinite(lon) &&
      lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }
  function safeText(value) {
    return String(value === null || value === undefined ? "" : value).trim();
  }
  function now() { return Date.now(); }
  function idText(value) {
    return safeText(value).toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
  }

  /* ---------- AIS AIVDM/AIVDO input ---------- */

  var AIS_TEXT = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ !\"#$%&'()*+,-./0123456789:;<=>?";

  function unwrapMessage(message) {
    var m = message;
    if (m && m.type === "thirdparty" && m.forwarded) m = m.forwarded;
    return m || {};
  }

  function rawToAscii(raw) {
    if (raw === null || raw === undefined) return "";
    if (typeof ArrayBuffer !== "undefined" && raw instanceof ArrayBuffer) {
      raw = new Uint8Array(raw);
    }
    if (typeof Uint8Array !== "undefined" && raw instanceof Uint8Array) {
      var out = "";
      for (var i = 0; i < raw.length; i++) out += String.fromCharCode(raw[i]);
      return out;
    }
    if (Array.isArray(raw)) {
      var chars = "";
      for (var j = 0; j < raw.length; j++) chars += String.fromCharCode(Number(raw[j]) & 255);
      return chars;
    }
    var text = String(raw);
    var hex = text.trim();
    if (hex.length >= 32 && hex.length % 2 === 0 && /^[0-9a-f]+$/i.test(hex)) {
      var decoded = "";
      for (var p = 0; p < hex.length; p += 2) {
        decoded += String.fromCharCode(parseInt(hex.slice(p, p + 2), 16));
      }
      if (decoded.indexOf("AIVDM") >= 0 || decoded.indexOf("AIVDO") >= 0) return decoded;
    }
    return text;
  }

  function findAisSentences(message) {
    var fields = [message.data, message.raw, message.nmea, message.message];
    var result = [];
    for (var i = 0; i < fields.length; i++) {
      var candidate = rawToAscii(fields[i]);
      if (!candidate) continue;
      var re = /!AIVD[MO],[^\r\n\x00]*/g;
      var match;
      while ((match = re.exec(candidate)) !== null) {
        var sentence = match[0].replace(/[\x00\x01-\x08\x0b\x0c\x0e-\x1f]+$/g, "").trim();
        if (sentence.length > 10) result.push(sentence);
      }
      if (!result.length) {
        var bare = /(?:^|[^A-Z0-9])AIVD[MO],[^\r\n\x00]*/g;
        while ((match = bare.exec(candidate)) !== null) {
          var s = match[0].replace(/^[^A-Z0-9]*AIVD/, "!AIVD").trim();
          if (s.length > 10) result.push(s);
        }
      }
      if (result.length) break;
    }
    return result;
  }

  function armorToBits(payload) {
    var bits = "";
    for (var i = 0; i < payload.length; i++) {
      var code = payload.charCodeAt(i), value;
      if (code >= 48 && code <= 87) value = code - 48;
      else if (code >= 96 && code <= 119) value = code - 56;
      else return "";
      bits += value.toString(2).padStart(6, "0");
    }
    return bits;
  }

  function hexToBits(hex) {
    var s = String(hex || "").replace(/[^0-9a-f]/gi, "");
    if (s.length < 8 || s.length % 2) return "";
    var bits = "";
    for (var i = 0; i < s.length; i += 2) {
      bits += parseInt(s.slice(i, i + 2), 16).toString(2).padStart(8, "0");
    }
    return bits;
  }

  function bitInt(bits, start, length) {
    if (!bits || start < 0 || length < 1 || start + length > bits.length || length > 31) return null;
    var n = parseInt(bits.slice(start, start + length), 2);
    return isFinite(n) ? n : null;
  }

  function bitSigned(bits, start, length) {
    var n = bitInt(bits, start, length);
    if (n === null) return null;
    var sign = Math.pow(2, length - 1), range = Math.pow(2, length);
    return n >= sign ? n - range : n;
  }

  function aisText(bits, start, length) {
    var out = "";
    for (var i = start; i + 6 <= Math.min(bits.length, start + length); i += 6) {
      var n = bitInt(bits, i, 6);
      if (n === null) break;
      var c = AIS_TEXT.charAt(n);
      out += c === "@" ? " " : c;
    }
    return out.replace(/\s+/g, " ").trim();
  }

  function fillPosition(result, bits, lonStart, latStart, lonLength, latLength, scale) {
    var lonRaw = bitSigned(bits, lonStart, lonLength);
    var latRaw = bitSigned(bits, latStart, latLength);
    if (lonRaw === null || latRaw === null) return;
    var lon = lonRaw / scale, lat = latRaw / scale;
    if (validPosition(lat, lon) && !(Math.abs(lat) >= 90 || Math.abs(lon) >= 180)) {
      result.lat = lat;
      result.lon = lon;
    }
  }

  function decodeAisBits(bits) {
    if (!bits || bits.length < 38) return null;
    var type = bitInt(bits, 0, 6);
    var mmsi = bitInt(bits, 8, 30);
    if (type === null || mmsi === null || mmsi === 0) return null;
    var r = { mmsi: String(mmsi), aisType: type, receivedAt: now() };

    if (type === 1 || type === 2 || type === 3) {
      if (bits.length < 143) return r;
      var sogA = bitInt(bits, 50, 10), cogA = bitInt(bits, 116, 12), hdgA = bitInt(bits, 128, 9);
      if (sogA !== null && sogA < 1023) r.sogKn = sogA / 10;
      if (cogA !== null && cogA < 3600) r.cogDeg = cogA / 10;
      if (hdgA !== null && hdgA < 511) r.headingDeg = hdgA;
      r.navStatus = bitInt(bits, 38, 4);
      fillPosition(r, bits, 61, 89, 28, 27, 600000);
    } else if (type === 18 || type === 19) {
      if (bits.length < 139) return r;
      var sogB = bitInt(bits, 46, 10), cogB = bitInt(bits, 112, 12), hdgB = bitInt(bits, 124, 9);
      if (sogB !== null && sogB < 1023) r.sogKn = sogB / 10;
      if (cogB !== null && cogB < 3600) r.cogDeg = cogB / 10;
      if (hdgB !== null && hdgB < 511) r.headingDeg = hdgB;
      fillPosition(r, bits, 57, 85, 28, 27, 600000);
      if (type === 19 && bits.length >= 271) {
        r.name = aisText(bits, 143, 120);
        r.shipType = bitInt(bits, 263, 8);
      }
    } else if (type === 4 || type === 11) {
      if (bits.length >= 134) {
        r.isStation = true;
        fillPosition(r, bits, 79, 107, 28, 27, 600000);
      }
    } else if (type === 5) {
      if (bits.length >= 240) {
        var imo = bitInt(bits, 40, 30);
        if (imo) r.imo = imo;
        r.callsign = aisText(bits, 70, 42);
        r.name = aisText(bits, 112, 120);
        r.shipType = bitInt(bits, 232, 8);
        var fore = bitInt(bits, 240, 9), aft = bitInt(bits, 249, 9);
        var port = bitInt(bits, 258, 6), starboard = bitInt(bits, 264, 6);
        if (fore !== null && aft !== null && fore + aft > 0) r.lengthM = fore + aft;
        if (port !== null && starboard !== null && port + starboard > 0) r.beamM = port + starboard;
        if (bits.length >= 302) {
          var month = bitInt(bits, 274, 4), day = bitInt(bits, 278, 5);
          var hour = bitInt(bits, 283, 5), minute = bitInt(bits, 288, 6);
          if (month > 0 && month <= 12 && day > 0 && day <= 31 && hour < 24 && minute < 60) {
            r.eta = { month: month, day: day, hour: hour, minute: minute };
          }
          var draught = bitInt(bits, 294, 8);
          if (draught > 0 && draught < 255) r.draughtM = draught / 10;
        }
        if (bits.length >= 422) r.destination = aisText(bits, 302, 120);
      }
    } else if (type === 24) {
      var part = bitInt(bits, 38, 2);
      r.staticPart = part;
      if (part === 0 && bits.length >= 160) {
        r.name = aisText(bits, 40, 120);
      } else if (part === 1 && bits.length >= 162) {
        r.shipType = bitInt(bits, 40, 8);
        r.callsign = aisText(bits, 90, 42);
        var fore24 = bitInt(bits, 132, 9), aft24 = bitInt(bits, 141, 9);
        var port24 = bitInt(bits, 150, 6), star24 = bitInt(bits, 156, 6);
        if (fore24 !== null && aft24 !== null && fore24 + aft24 > 0) r.lengthM = fore24 + aft24;
        if (port24 !== null && star24 !== null && port24 + star24 > 0) r.beamM = port24 + star24;
      }
    } else if (type === 27) {
      if (bits.length >= 94) {
        var sog27 = bitInt(bits, 78, 6), cog27 = bitInt(bits, 84, 9);
        if (sog27 !== null && sog27 < 63) r.sogKn = sog27;
        if (cog27 !== null && cog27 < 360) r.cogDeg = cog27;
        fillPosition(r, bits, 44, 62, 18, 17, 600);
      }
    }
    return r;
  }

  function parseNmeaSentence(sentence, context) {
    var s = String(sentence || "").trim();
    if (s.charAt(0) !== "!") s = "!" + s.replace(/^.*?(AIVD[MO],)/, "$1");
    if (!/^!AIVD[MO],/.test(s)) return null;
    var fields = s.split(",");
    if (fields.length < 7) return null;
    var total = parseInt(fields[1], 10) || 1;
    var number = parseInt(fields[2], 10) || 1;
    var sequence = String(fields[3] || "");
    var channel = String(fields[4] || "");
    var payload = String(fields[5] || "");
    var fillText = String(fields[6] || "").split("*")[0];
    var fillBits = parseInt(fillText, 10) || 0;
    if (!payload || total < 1 || total > 9 || number < 1 || number > total || fillBits > 5) return null;

    if (total > 1) {
      var ctx = context || {};
      var key = [ctx.source || "AIS", ctx.freq || "", channel, sequence || "-"].join("|");
      var part = FRAGMENTS[key];
      if (!part || part.total !== total || now() - part.at > 12000) {
        part = FRAGMENTS[key] = { total: total, parts: [], fillBits: 0, at: now() };
      }
      part.parts[number - 1] = payload;
      if (number === total) part.fillBits = fillBits;
      part.at = now();
      var complete = true;
      for (var i = 0; i < total; i++) if (!part.parts[i]) complete = false;
      if (!complete) return null;
      payload = part.parts.join("");
      fillBits = part.fillBits;
      delete FRAGMENTS[key];
    }

    var bits = armorToBits(payload);
    if (!bits) return null;
    if (fillBits > 0 && fillBits < bits.length) bits = bits.slice(0, bits.length - fillBits);
    var decodedMessage = decodeAisBits(bits);
    if (decodedMessage && context) {
      if (context.source) decodedMessage.source = safeText(context.source);
      if (context.freq) decodedMessage.freq = safeText(context.freq);
    }
    return decodedMessage;
  }

  function parsePackedAisHex(hex) {
    var bits = hexToBits(hex);
    return bits ? decodeAisBits(bits) : null;
  }

  function parseAisFromMessage(message) {
    var m = unwrapMessage(message);
    var sentences = findAisSentences(m);
    for (var i = 0; i < sentences.length; i++) {
      var decoded = parseNmeaSentence(sentences[i], {
        source: m.source || m.destination || "AIS",
        freq: m.freq || ""
      });
      if (decoded) return decoded;
    }
    if (sentences.length) return null; /* multipart NMEA is buffered; do not misread one fragment as a full packed frame */
    if (m.type === "nmea" && String(m.nmea_type || "").indexOf("AIVDM") === 0 && m.message) {
      return parsePackedAisHex(m.message);
    }
    return null;
  }

  function aisModelKind(record) {
    var t = Number(record.shipType), name = String(record.name || "").toUpperCase();
    if ((t >= 70 && t <= 79) || /CARGO|TRADER|CONTAINER|FREIGHT/.test(name)) return "cargo";
    if ((t >= 80 && t <= 89) || /TANK|CHEM|LNG|LPG|GAS CARRIER/.test(name)) return "tanker";
    if ((t >= 60 && t <= 69) || /FERRY|PASSENGER|CRUISE/.test(name)) return "passenger";
    if ((t >= 40 && t <= 49) || /HIGH.?SPEED|CATAMARAN|\bHSC\b/.test(name)) return "hsc";
    if (t === 50 || /\bPILOT\b|LOTSEN/.test(name)) return "pilot";
    if (t === 51 || /\bSAR\b|RESCUE|LIFEBOAT/.test(name)) return "sar";
    if (t === 31 || t === 32 || t === 52 || t === 53 || /\bTUG\b|TOWING|SCHLEPPER/.test(name)) return "tug";
    if (t === 33 || /DREDG|HOPPER|BAGGER/.test(name)) return "dredger";
    if (t === 35 || t === 55 || /PATROL|POLICE|COAST.?GUARD|NAVY|MILITARY/.test(name)) return "patrol";
    if (t === 30 || /FISH|TRAWLER/.test(name)) return "fishing";
    if (t === 36 || /SAIL/.test(name)) return "sail";
    if (t === 37 || /YACHT|PLEASURE/.test(name)) return "yacht";
    return "generic";
  }

  function aisModelAssetKey(record) {
    if (!record || record.isStation || record.isAid) return null;
    var kind = record.kindName || aisModelKind(record);
    var name = String(record.name || "").toUpperCase();
    var length = asNumber(record.lengthM) || MODEL_BASE_LENGTH[kind] || 75;
    if (kind === "cargo") return /\b(BULK|ORE|CEMENT)\b/.test(name) ? "bulk" : "container";
    if (kind === "tanker") return /\b(LNG|LPG|GAS)\b/.test(name) ? "lng" : "tanker";
    if (kind === "passenger") {
      if (/\b(FERRY|FAEHRE|FÄHRE)\b/.test(name)) return length < 60 ? "ferry_small" : "ferry";
      if (length >= 150 || /\b(CRUISE|OCEAN LINER)\b/.test(name)) return "cruise";
      return length < 60 ? "ferry_small" : "ferry";
    }
    if (kind === "hsc") return "ferry_small";
    if (kind === "patrol") return "navy";
    if (kind === "yacht") return length < 10 ? "runabout" : "yacht";
    if (kind === "sail") return "sail";
    if (kind === "pilot") return "pilot";
    if (kind === "fishing") return "fishing";
    if (kind === "tug" || kind === "dredger" || kind === "sar") return "tug";
    if (kind === "generic") return length >= 150 ? "container" : (length < 10 ? "runabout" : "tug");
    return "tug";
  }

  // Only explicit existing type metadata. No callsign/operator/registration guess,
  // no photo scan, no external database. NEO/MAX variants are NOT these airframes.
  var TYPE_DB_COMMIT = "e7ff3f1474334b3f00d50a6661ef1c16754721a5";
  var TYPE_DB_CACHE = Object.create(null);
  function lookupAircraftType(record) {
    if (!record || !window.fetch) return;
    var hex = String(record.icao || record.id || "").toUpperCase();
    if (!/^[0-9A-F]{6}$/.test(hex)) return;
    var registration = aircraftRegistration(record).toUpperCase().replace(/[^A-Z0-9]/g, "");
    var requestKey = hex + "|" + registration;
    if (record.__typeLookupDone === requestKey || record.__typeLookupPending === requestKey) return;
    var prefix = hex.slice(0, 2), cache = TYPE_DB_CACHE[prefix];
    if (cache && cache.failedUntil && now() < cache.failedUntil) return;
    if (!cache || cache.failedUntil) {
      cache = TYPE_DB_CACHE[prefix] = {};
      cache.promise = window.fetch(APP_ROOT + "/models/adsb-realistic/bluebell-neutral/type-db/" + prefix +
        ".json?v=" + TYPE_DB_COMMIT.slice(0,12), { credentials: "same-origin", cache: "force-cache" })
        .then(function (response) { if (!response.ok) throw new Error("local type database unavailable"); return response.json(); })
        .then(function (data) {
          if (!data || data.schema !== 1 || data.commit !== TYPE_DB_COMMIT || !data.aircraft) throw new Error("wrong local type database version");
          return data.aircraft;
        }).catch(function () { cache.failedUntil = now() + 30000; return null; });
    }
    record.__typeLookupPending = requestKey;
    cache.promise.then(function (rows) {
      record.__typeLookupPending = null;
      if (!rows || RECORDS.adsb[record.id] !== record) return;
      // A registry change while awaiting the local shard invalidates this reply.
      if (aircraftRegistration(record).toUpperCase().replace(/[^A-Z0-9]/g, "") !== registration) return;
      var entry = rows[hex.slice(2)];
      record.modelType = "";
      record.modelTypeDbRegistration = "";
      record.modelTypeStatus = "kein Datenbanktreffer";
      if (entry && /^[A-Z0-9]{2,4}$/.test(entry[1] || "")) {
        var dbRegistration = String(entry[0] || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (registration && dbRegistration && registration !== dbRegistration) {
          record.modelTypeStatus = "Registrierung weicht von Datenbank ab · keine Typübernahme";
        } else {
          record.modelType = entry[1];
          record.modelTypeDbRegistration = entry[0] || "";
          record.modelTypeStatus = "Mictronics · ODC-By · Stand 18.10.2026";
        }
      }
      record.__typeLookupDone = requestKey;
      // Display-only metadata: do NOT refresh lastSeen/lastPositionAt or raw reports.
      scheduleSync("adsb");
    });
  }

  function exactAircraftType(record) {
    if (!record) return "";
    var text = safeText(record.aircraft || record.modelType || record.type || record.category).trim().toUpperCase();
    text = text.replace(/^(AIRBUS|BOEING)\s+/, "");
    if (/^(A319|A320|A321|A333|A388|B738|B744|B772)$/.test(text)) return text;
    var match = /^(A319|A320|A321)-[12][0-9]{2}$/.exec(text);
    if (match) return match[1];
    var aliases = {"A330-300":"A333","A380-800":"A388","737-800":"B738","B737-800":"B738",
      "747-400":"B744","B747-400":"B744","777-200":"B772","B777-200":"B772"};
    return aliases[text] || "";
  }

  function aircraftModelNotice(record) {
    var type = exactAircraftType(record);
    if (type) return type + " · neutrales Typmodell · keine Airline-Lackierung";
    var key = adsbModelAssetKey(record);
    var labels = {single_prop:"Einmotoriges Propellerflugzeug", twin_prop:"Zweimotoriges Propellerflugzeug",
      helicopter:"Drehflügler/Hubschrauber", drone:"Unbemanntes Luftfahrzeug", glider:"Segelflugzeug", balloon:"Ballon"};
    return labels[key] ? labels[key] + " · eigenes schematisches Klassenmodell · keine exakte Bauform" : "Klassen-/Ersatzmodell · Typ nicht im neutralen Bestand";
  }

  function adsbModelAssetKey(record) {
    if (!record) return null;
    var exact = exactAircraftType(record);
    if (exact) return "bb_" + exact.toLowerCase();
    var type = safeText(record.aircraft || record.modelType || record.type).toUpperCase().replace(/[^A-Z0-9]/g, "");
    var category = safeText(record.category).toUpperCase().replace(/[^A-Z0-9]/g, "");
    /* Some ADS-B-LIST producers put the ICAO type code in `type`/`category` instead of `aircraft`. */
    if (!type && /^[A-Z0-9]{3,8}$/.test(category)) type = category;
    if (/^(DRON|DRONE|UAV|UAS|MAVIC|DJI)/.test(type)) return "drone";
    if (/EVTOL|VTOL/.test(type)) return "evtol";
    if (/^(A388|A380)/.test(type)) return "a380";
    if (/^(A35|A359|A35K|A350)/.test(type) || /^A3[34]/.test(type)) return "a350";
    if (/^(B788|B789|B78X|B787|B77|B74|B76|B747|B777|B767)/.test(type)) return "b787";
    if (/^(A318|A319|A320|A321|A20N|A21N|A19N|A31|A32)/.test(type)) return "a320";
    if (/^(B736|B737|B738|B739|B37M|B38M|B39M|B73)/.test(type)) return "b737";
    if (/^(F15|F15E|F15K)/.test(type)) return "f15";
    if (/^(ASK|ASW|DG[0-9]|LS[0-9]|SZD|GLID|GLIM|G102|G103)/.test(type)) return "glider";
    if (/^(A109|A119|A139|A169|A189|AS[0-9]{2,3}|EC[0-9]{2,3}|H1[0-9]{2}|R22|R44|R66|B0[6-9]T?|B105|B212|B214|B222|B230|B407|B412|B427|B429|B430|B47|S7[0-9]|S92|NH90|UHEL)$/.test(type)) return "helicopter";
    // Explicit common type facts, not an inference from weight or callsign.
    if (/^(C150|C152|C162|C170|C172|C175|C177|C180|C182|C185|C206|C207|C208|C210|PA18|PA28|P28A|P28B|P28R|P28T|P32R|P32T|SR20|SR22|DA20|DA40|DV20|AA5|RV7|RV8|RV9)$/.test(type)) return "single_prop";
    if (/^(C303|C310|C335|C340|C402|C404|C414|C421|C425|C441|PA23|PA27|PA30|PA31|PA34|PA44|DA42|DA62|BE20|BE30|BE55|BE58|BE60|BE76|BE90|BE99|B350|AT43|AT45|AT46|AT72|AT75|AT76|DH8A|DH8B|DH8C|DH8D)$/.test(type)) return "twin_prop";
    if (type === "BALL") return "balloon";
    // DO-260 category is not an engine-count database. B2 also includes
    // airships; A1/B4 cannot establish a propeller count. Never guess these.
    if (category === "A7") return "helicopter";
    if (category === "B1") return "glider";
    if (category === "B6") return "drone";
    return null;
  }

  function aisShipDimensions(record) {
    var kind = record && (record.kindName || aisModelKind(record));
    var length = asNumber(record && record.lengthM);
    var beam = asNumber(record && record.beamM);
    if (length !== null && beam !== null && beam > length) {
      var swap = length; length = beam; beam = swap;
    }
    if (length === null || length <= 0) length = MODEL_BASE_LENGTH[kind] || 75;
    length = clamp(length, 4, 460);
    if (beam === null || beam <= 0) beam = length * (AIS_DEFAULT_BEAM_RATIO[kind] || 0.22);
    beam = clamp(Math.min(beam, length / 2), 1.5, 70);
    return { length: length, beam: beam, kind: kind };
  }

  function normalizeAngleDegrees(value) {
    return ((Number(value) % 360) + 360) % 360;
  }

  function shortestAngleDelta(from, to) {
    return ((normalizeAngleDegrees(to) - normalizeAngleDegrees(from) + 540) % 360) - 180;
  }

  function followCameraLocal(heading, yaw, pitch, range, aimHeight) {
    var bearing = (Number(heading) + 180 - Number(yaw)) * Math.PI / 180;
    var elevation = Number(pitch) * Math.PI / 180;
    var flat = Number(range) * Math.cos(elevation);
    return {
      east: Math.sin(bearing) * flat,
      north: Math.cos(bearing) * flat,
      up: Number(range) * Math.sin(elevation) + Number(aimHeight || 0)
    };
  }

  function appendTrack(record, lat, lon, altitude, limit) {
    var point = { lat: lat, lon: lon, altitude: altitude || 0, at: now() };
    var track = record.track || (record.track = []);
    var last = track.length ? track[track.length - 1] : null;
    if (last && Math.abs(last.lat - lat) < 0.00003 && Math.abs(last.lon - lon) < 0.00003 &&
        Math.abs((last.altitude || 0) - (altitude || 0)) < 5) {
      last.at = point.at;
      last.altitude = point.altitude;
      return;
    }
    track.push(point);
    if (track.length > (limit || 80)) track.splice(0, track.length - (limit || 80));
  }

  function updateAisRecord(decoded) {
    if (!decoded || !decoded.mmsi) return null;
    var mmsi = String(decoded.mmsi).replace(/\D/g, "");
    if (mmsi.length < 5 || mmsi.length > 9 || /^0+$/.test(mmsi)) return null;
    var record = RECORDS.ais[mmsi] || (RECORDS.ais[mmsi] = {
      id: mmsi, mmsi: mmsi, kind: "ais", track: [], reports: 0,
      lastSeen: 0, lastPositionAt: 0, shipType: null
    });
    record.reports++;
    record.lastSeen = now();
    record.aisType = decoded.aisType !== undefined ? decoded.aisType : record.aisType;
    if (decoded.name) record.name = decoded.name;
    if (decoded.callsign) record.callsign = decoded.callsign;
    if (decoded.shipType !== null && decoded.shipType !== undefined) record.shipType = Number(decoded.shipType);
    if (decoded.lengthM !== null && decoded.lengthM !== undefined && Number(decoded.lengthM) > 0) record.lengthM = Number(decoded.lengthM);
    if (decoded.beamM !== null && decoded.beamM !== undefined && Number(decoded.beamM) > 0) record.beamM = Number(decoded.beamM);
    if (decoded.sogKn !== null && decoded.sogKn !== undefined) record.sogKn = Number(decoded.sogKn);
    if (decoded.cogDeg !== null && decoded.cogDeg !== undefined) record.cogDeg = Number(decoded.cogDeg);
    if (decoded.headingDeg !== null && decoded.headingDeg !== undefined) record.headingDeg = Number(decoded.headingDeg);
    if (decoded.navStatus !== null && decoded.navStatus !== undefined) record.navStatus = Number(decoded.navStatus);
    if (decoded.imo !== null && decoded.imo !== undefined && Number(decoded.imo) > 0) record.imo = String(decoded.imo);
    if (decoded.destination) record.destination = safeText(decoded.destination);
    if (decoded.draughtM !== null && decoded.draughtM !== undefined) record.draughtM = Number(decoded.draughtM);
    if (decoded.eta) record.eta = decoded.eta;
    if (decoded.source) record.source = safeText(decoded.source);
    if (decoded.freq) record.freq = safeText(decoded.freq);
    if (decoded.isStation) record.isStation = true;
    if (decoded.isAid) record.isAid = true;
    record.kindName = record.isStation ? "station" : record.isAid ? "aid" : aisModelKind(record);
    var lat = asNumber(decoded.lat), lon = asNumber(decoded.lon);
    if (validPosition(lat, lon)) {
      record.lat = lat;
      record.lon = lon;
      record.lastPositionAt = now();
      updateMotion2d(record);
      var scale = record.lengthM ? clamp(record.lengthM / (MODEL_BASE_LENGTH[record.kindName] || 75), 0.4, 3.0) : 1;
      appendTrack(record, lat, lon, 5 * scale, 100);
    }
    scheduleSync("ais");
    return record;
  }

  function ingestAis(message) {
    var m = unwrapMessage(message);
    if (m.mode && String(m.mode).toUpperCase() !== "AIS") return null;
    var decoded = parseAisFromMessage(m);
    if (decoded) return updateAisRecord(decoded);
    if (m.type === "nmea") return null;

    var id = safeText(m.mmsi || m.mmsi_number || m.object || m.item || m.vessel_id || "");
    if (!id && m.source && String(m.source).toUpperCase() !== "AIS") id = safeText(m.source);
    id = id.replace(/\D/g, "");
    if (id.length < 5 || id.length > 9 || /^0+$/.test(id)) return null;
    var lat = asNumber(m.lat, m.latitude), lon = asNumber(m.lon, m.longitude);
    var fallback = {
      mmsi: id, aisType: asNumber(m.ais_type, m.msg_type, m.type_id),
      name: safeText(m.ship_name || m.name || m.vessel_name || ""),
      callsign: safeText(m.callsign || ""),
      shipType: asNumber(m.ship_type, m.shipType, m.vessel_type),
      lengthM: asNumber(m.length_m, m.length), beamM: asNumber(m.beam_m, m.beam),
      sogKn: asNumber(m.sog_kn, m.sog), cogDeg: asNumber(m.cog_deg, m.cog, m.course),
      headingDeg: asNumber(m.true_heading, m.heading), imo: asNumber(m.imo),
      destination: safeText(m.destination || m.dest || ""), draughtM: asNumber(m.draught_m, m.draught),
      lat: lat, lon: lon
    };
    if (fallback.name && /^\d{5,9}$/.test(fallback.name)) fallback.name = "";
    return updateAisRecord(fallback);
  }

  /* ---------- ADS-B-LIST input ---------- */

  function ingestAdsb(message) {
    var m = unwrapMessage(message);
    if (!m || (m.mode && String(m.mode).toUpperCase() !== "ADSB-LIST")) return 0;
    var list = m.aircraft;
    if (!Array.isArray(list)) {
      if (list && typeof list === "object") {
        var converted = [];
        Object.keys(list).forEach(function (key) { if (list[key] && typeof list[key] === "object") converted.push(list[key]); });
        list = converted;
      } else return 0;
    }
    var updated = 0;
    for (var i = 0; i < list.length; i++) {
      var entry = list[i] || {};
      var id = idText(entry.icao || entry.ICAO || entry.hex || entry.address || entry.aircraft || entry.flight);
      if (!id) continue;
      var record = RECORDS.adsb[id] || (RECORDS.adsb[id] = {
        id: id, kind: "adsb", track: [], reports: 0,
        lastSeen: 0, lastPositionAt: 0
      });
      var receivedAt = now();
      var sourceAt = asNumber(entry.timestamp);
      if (sourceAt !== null) sourceAt = sourceAt < 100000000000 ? sourceAt * 1000 : sourceAt;
      else sourceAt = receivedAt - Math.max(0, asNumber(entry.seen) || 0) * 1000;
      sourceAt = Math.min(receivedAt, sourceAt);
      // A periodic list is a cache snapshot, not a fresh aircraft report.
      if (record.__sourceAt && sourceAt < record.__sourceAt) continue;
      if (!record.__sourceAt || sourceAt > record.__sourceAt) record.reports++;
      record.__sourceAt = sourceAt;
      record.lastSeen = Math.max(record.lastSeen || 0, sourceAt);
      record.icao = id;
      record.flight = safeText(entry.flight || entry.callsign || record.flight || "");
      var tail = aircraftRegistration({aircraft:entry.aircraft});
      record.aircraft = safeText(entry.aircraft_type || entry.type_designator || (tail ? "" : entry.aircraft) || record.aircraft || "");
      record.registration = safeText(entry.registration || entry.reg || entry.r || entry.tail || tail || record.registration || "");
      record.squawk = safeText(entry.squawk || record.squawk || "");
      record.emergency = safeText(entry.emergency || record.emergency || "");
      record.category = safeText(entry.category || entry.type || record.category || "");
      record.altitudeFt = asNumber(entry.altitude, entry.altitude_ft, entry.alt_baro, entry.alt, record.altitudeFt);
      record.geomAltitudeFt = asNumber(entry.altitude_geom, entry.alt_geom, entry.altitude_geometric, record.geomAltitudeFt);
      record.navAltitudeFt = asNumber(entry.nav_altitude_mcp, entry.nav_altitude_fms, entry.nav_altitude, record.navAltitudeFt);
      record.speedKn = asNumber(entry.speed, entry.speed_knots, entry.gs, entry.groundspeed, entry.ground_speed, record.speedKn);
      record.courseDeg = asNumber(entry.course, entry.track, entry.heading, entry.course_deg, entry.track_deg, record.courseDeg);
      record.vspeedFpm = asNumber(entry.vspeed, entry.vertical_rate, entry.baro_rate, record.vspeedFpm);
      record.messageCount = asNumber(entry.messages, entry.message_count, entry.msgs, record.messageCount);
      record.rssi = asNumber(entry.rssi, entry.signal, record.rssi);
      record.seenSec = asNumber(entry.seen, entry.last_seen, record.seenSec);
      record.seenPosSec = asNumber(entry.seen_pos, entry.position_age, record.seenPosSec);
      record.source = safeText(entry.source || entry.receiver || record.source || "");
      record.freq = safeText(entry.freq || entry.frequency || record.freq || "");
      lookupAircraftType(record);
      var lat = asNumber(entry.lat, entry.latitude), lon = asNumber(entry.lon, entry.longitude);
      if (validPosition(lat, lon)) {
        var changed = record.lat !== lat || record.lon !== lon;
        var explicitAge = asNumber(entry.seen_pos, entry.position_age);
        var positionAt = explicitAge !== null ? receivedAt - Math.max(0, explicitAge) * 1000 : sourceAt;
        // v4.45: never replace a position by an older fix, even if other
        // fields in the snapshot are newer. Telemetry remains unmodified.
        if (record.lastPositionAt && positionAt < record.lastPositionAt - 1) { updated++; continue; }
        record.lat = lat;
        record.lon = lon;
        record.altitudeM = Math.max(0, (record.altitudeFt || 0) * 0.3048);
        if (!record.lastPositionAt || changed) record.lastPositionAt = positionAt;
        // Without position-age metadata, unchanged coordinates are not a new fix.
        record.__positionAgeSec = Math.max(0, (receivedAt - record.lastPositionAt) / 1000);
        updateMotion2d(record);
        appendTrack(record, lat, lon, record.altitudeM, 90);
      }
      updated++;
    }
    scheduleSync("adsb");
    return updated;
  }

  function getRecords(kind) {
    var ttl = kind === "adsb" ? 150000 : 1800000;
    var records = RECORDS[kind] || {};
    var nowValue = now(), result = [];
    Object.keys(records).forEach(function (id) {
      var record = records[id];
      if (nowValue - (record.lastSeen || 0) > ttl) {
        delete records[id];
        return;
      }
      if (record.lastPositionAt && nowValue - record.lastPositionAt <= ttl &&
          validPosition(record.lat, record.lon) && recordPassesFilters(kind, record)) result.push(record);
    });
    return result;
  }

  /* ---- v4.15: SDRangel-style name/distance filters ---- */
  var MY_POSITION = [51.66, 6.97];
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371, p = Math.PI / 180;
    var a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 +
      Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  function recordPassesFilters(kind, record) {
    var rec = WINDOWS[kind], prefs = rec && rec.prefs ? rec.prefs : {};
    var nameFilter = safeText(prefs.filterName || "");
    if (nameFilter) {
      var hay = [record.flight, record.name, record.callsign, record.id, record.mmsi, record.aircraft]
        .filter(Boolean).join(" ");
      var rx = null;
      try { rx = new RegExp(nameFilter, "i"); } catch (e) {}
      if (rx ? !rx.test(hay) : hay.toLowerCase().indexOf(nameFilter.toLowerCase()) < 0) return false;
    }
    var dist = Number(prefs.filterDistance) || 0;
    if (dist > 0 && validPosition(record.lat, record.lon)) {
      if (haversineKm(MY_POSITION[0], MY_POSITION[1], record.lat, record.lon) > dist) return false;
    }
    return true;
  }

  /* ---------- Cesium loading and rendering ---------- */

  function ensureCesiumCss() {
    if (byId("dnx-am-cesium-css")) return;
    var link = document.createElement("link");
    link.id = "dnx-am-cesium-css";
    link.rel = "stylesheet";
    link.href = CESIUM_CSS;
    document.head.appendChild(link);
  }

  function loadCesium() {
    if (window.Cesium) {
      window.CESIUM_BASE_URL = CESIUM_ROOT;
      ensureCesiumCss();
      return Promise.resolve(window.Cesium);
    }
    if (cesiumPromise) return cesiumPromise;
    window.CESIUM_BASE_URL = CESIUM_ROOT;
    ensureCesiumCss();
    var existing = byId("dnx-am-cesium-js");
    if (existing && (existing.dataset.dnxAmLoaded === "1" || existing.dataset.dnxAmFailed === "1") && !window.Cesium) {
      try { existing.parentNode.removeChild(existing); } catch (e) {}
      existing = null;
    }
    cesiumPromise = new Promise(function (resolve, reject) {
      if (existing) {
        existing.addEventListener("load", function () {
          existing.dataset.dnxAmLoaded = "1";
          window.Cesium ? resolve(window.Cesium) : reject(new Error("Cesium global fehlt"));
        }, { once: true });
        existing.addEventListener("error", function () {
          existing.dataset.dnxAmFailed = "1";
          reject(new Error("CesiumJS konnte nicht geladen werden"));
        }, { once: true });
        if (window.Cesium) resolve(window.Cesium);
        return;
      }
      var script = document.createElement("script");
      script.id = "dnx-am-cesium-js";
      script.async = true;
      script.src = CESIUM_JS;
      script.onload = function () {
        script.dataset.dnxAmLoaded = "1";
        if (window.Cesium) resolve(window.Cesium);
        else reject(new Error("CesiumJS geladen, aber Cesium global fehlt"));
      };
      script.onerror = function () {
        script.dataset.dnxAmFailed = "1";
        reject(new Error("Lokales CesiumJS konnte nicht geladen werden"));
      };
      document.head.appendChild(script);
    });
    cesiumPromise.catch(function () { cesiumPromise = null; });
    return cesiumPromise;
  }

  function ensureLeafletCss() {
    if (byId("dnx-am-leaflet-css")) return;
    var link = document.createElement("link");
    link.id = "dnx-am-leaflet-css";
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }

  function loadLeaflet() {
    ensureLeafletCss();
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var existing = byId("dnx-am-leaflet-js");
      if (existing) {
        existing.addEventListener("load", function () {
          window.L ? resolve(window.L) : reject(new Error("Leaflet global fehlt"));
        }, { once: true });
        existing.addEventListener("error", function () { reject(new Error("Leaflet konnte nicht geladen werden")); }, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.id = "dnx-am-leaflet-js";
      script.async = true;
      script.src = LEAFLET_JS;
      script.onload = function () { window.L ? resolve(window.L) : reject(new Error("Leaflet geladen, aber L fehlt")); };
      script.onerror = function () { reject(new Error("Lokales Leaflet konnte nicht geladen werden")); };
      document.head.appendChild(script);
    });
    leafletPromise.catch(function () { leafletPromise = null; });
    return leafletPromise;
  }

  function defaultView(viewer) {
    var C = window.Cesium;
    try {
      viewer.camera.flyTo({
        destination: C.Cartesian3.fromDegrees(7.5, 51.7, 2300000),
        duration: 0.4
      });
    } catch (e) {}
  }

  function safeDestroyViewer(rec) {
    if (!rec) return;
    if (rec.resizeObserver) {
      try { rec.resizeObserver.disconnect(); } catch (e) {}
      rec.resizeObserver = null;
    }
    if (rec.mapResizeObserver) {
      try { rec.mapResizeObserver.disconnect(); } catch (e2) {}
      rec.mapResizeObserver = null;
    }
    if (rec.follow && rec.follow.raf && window.cancelAnimationFrame) {
      try { window.cancelAnimationFrame(rec.follow.raf); } catch (e3) {}
    }
    rec.follow = null;
    rec.pendingFollowId = null;
    if (rec.nativeFocusBoundsRestore) { rec.nativeFocusBoundsRestore(); rec.nativeFocusBoundsRestore = null; }
    if (rec.selectionRenderRemove) { try { rec.selectionRenderRemove(); } catch (e) {} rec.selectionRenderRemove = null; }
    if (rec.viewer && rec.viewer.scene && rec.viewer.scene.canvas) {
      var selectionCanvas = rec.viewer.scene.canvas;
      if (rec.selectionClickHandler) selectionCanvas.removeEventListener("click", rec.selectionClickHandler);
      if (rec.selectionDoubleHandler) selectionCanvas.removeEventListener("dblclick", rec.selectionDoubleHandler);
      if (rec.selectionPointerHandler) selectionCanvas.removeEventListener("pointerdown", rec.selectionPointerHandler, true);
    }
    rec.selectionClickHandler = null; rec.selectionPointerHandler = null;
    rec.selectionDoubleHandler = null; rec.nativeTargets = null; rec.__nativeIndicatorKey = null;
    if (rec.followInputHandlers && rec.viewer && rec.viewer.scene && rec.viewer.scene.canvas) {
      var followCanvas = rec.viewer.scene.canvas;
      Object.keys(rec.followInputHandlers).forEach(function (eventName) {
        var spec = rec.followInputHandlers[eventName];
        try { followCanvas.removeEventListener(eventName, spec.handler, !!spec.capture); } catch (e4) {}
      });
      rec.followInputHandlers = null;
    }
    if (rec.trafficZoomHandler && rec.viewer && rec.viewer.scene && rec.viewer.scene.canvas) {
      try { rec.viewer.scene.canvas.removeEventListener("wheel", rec.trafficZoomHandler, true); } catch (e4b) {}
      rec.trafficZoomHandler = null;
    }
    if (rec.shipModels) {
      Object.keys(rec.shipModels).forEach(function (id) { removeShipModel(rec, id); });
      rec.shipModels = Object.create(null);
    }
    if (rec.aircraftModels) {
      Object.keys(rec.aircraftModels).forEach(function (id) { removeAircraftModel(rec, id); });
      rec.aircraftModels = Object.create(null);
    }
    if (rec.canvasContextHandler && rec.viewer && rec.viewer.scene && rec.viewer.scene.canvas) {
      try { rec.viewer.scene.canvas.removeEventListener("contextmenu", rec.canvasContextHandler); } catch (e3) {}
      rec.canvasContextHandler = null;
    }
    stopTrackReplay(rec);
    if (rec.infoTimer) { window.clearInterval(rec.infoTimer); rec.infoTimer = null; }
    if (rec.infoPanel && rec.infoPanel.parentNode) { try { rec.infoPanel.parentNode.removeChild(rec.infoPanel); } catch (e4) {} }
    rec.infoPanel = null;
    if (contextMenu && contextMenu.__dnxOwner === rec) hideContextMenu();
    if (rec.map2d) {
      try { rec.map2d.remove(); } catch (e5) {}
      rec.map2d = null;
    }
    if (rec.viewer) {
      try { if (!rec.viewer.isDestroyed()) rec.viewer.destroy(); } catch (e6) {}
      rec.viewer = null;
    }
    rec.entities = Object.create(null);
    rec.entityKinds = Object.create(null);
    rec.map2dMarkers = Object.create(null);
    rec.map2dTracks = Object.create(null);
  }

  function createViewer(rec) {
    if (!rec || !rec.win || !rec.win.isConnected || rec.viewer || rec.loading) return;
    rec.loading = true;
    setStatus(rec, "Lade lokale Cesium-3D-Ansicht …");
    loadCesium().then(function (C) {
      if (!rec.win || !rec.win.isConnected) return;
      var box = q(".dnx-am-view", rec.win);
      if (!box) return;
      try {
        rec.viewer = new C.Viewer(box, {
          animation: false,
          timeline: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          infoBox: false,
          selectionIndicator: true,
          terrainProvider: new C.EllipsoidTerrainProvider(),
          imageryProvider: new C.UrlTemplateImageryProvider({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            credit: "© OpenStreetMap contributors",
            maximumLevel: 18
          }),
          requestRenderMode: true,
          maximumRenderTimeChange: 0.1
        });
        /* The clock must animate: sampled ADS-B positions are evaluated at
           clock.currentTime, and requestRenderMode re-renders on time change. */
        try {
          rec.viewer.allowDataSourcesToSuspendAnimation = false;
          rec.viewer.clock.canAnimate = true;
          rec.viewer.clock.shouldAnimate = true;
        } catch (e) {}
        installNativeFocusBounds(rec);
        try { if (window.Cesium && window.Cesium.Ion && window.DNX_CESIUM_ION_TOKEN) window.Cesium.Ion.defaultAccessToken = window.DNX_CESIUM_ION_TOKEN; } catch (e) {}
        // Native Cesium widget owns selection placement; our existing photo/link
        // panel supplies the information UI without a second competing InfoBox.
        if (rec.viewer.screenSpaceEventHandler && C.ScreenSpaceEventType) {
          rec.viewer.screenSpaceEventHandler.removeInputAction(C.ScreenSpaceEventType.LEFT_CLICK);
          rec.viewer.screenSpaceEventHandler.removeInputAction(C.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        }
        installMotionTicker(rec);
        applyBaseMap3D(rec);
        applyDisplayPrefs(rec);
        applyWeatherLayers(rec);
        applyPositionRings(rec);
        var canvas = rec.viewer.scene.canvas;
        rec.canvasContextHandler = function (event) {
          event.preventDefault();
          var rect = canvas.getBoundingClientRect();
          var position = new C.Cartesian2(event.clientX - rect.left, event.clientY - rect.top);
          var picked = null;
          try { picked = rec.viewer.scene.pick(position); } catch (e) {}
          var target = pickedTarget(picked);
          if (target) showContextMenu(rec, target.kind, target.id, event.clientX, event.clientY);
        };
        canvas.addEventListener("contextmenu", rec.canvasContextHandler);
        rec.selectionPointerHandler = function (event) { rec.__selectionDown = { x: event.clientX, y: event.clientY }; };
        rec.selectionClickHandler = function (event) {
          if (event.button !== 0) return;
          var down = rec.__selectionDown;
          if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return;
          var rect = canvas.getBoundingClientRect();
          var target = pickTrafficTarget(rec, new C.Cartesian2(event.clientX - rect.left, event.clientY - rect.top));
          selectTrafficTarget(rec, target && target.kind, target && target.id);
        };
        canvas.addEventListener("pointerdown", rec.selectionPointerHandler, true);
        canvas.addEventListener("click", rec.selectionClickHandler);
        rec.selectionDoubleHandler = function (event) {
          if (event.button !== 0) return;
          var rect = canvas.getBoundingClientRect();
          var target = pickTrafficTarget(rec, new C.Cartesian2(event.clientX - rect.left, event.clientY - rect.top));
          if (!target) return;
          selectTrafficTarget(rec, target.kind, target.id);
          startFollowTarget(rec, target.id);
        };
        canvas.addEventListener("dblclick", rec.selectionDoubleHandler);
        rec.selectionRenderRemove = rec.viewer.scene.postRender.addEventListener(function () { updateSelectionFrame(rec); updateTrafficLabels(rec); });
        installFollowInput(rec);
        installTrafficZoom(rec);
        try {
          rec.viewer.scene.globe.enableLighting = true;
          if (rec.viewer.scene.shadowMap) rec.viewer.scene.shadowMap.enabled = true;
          rec.viewer.scene.backgroundColor = C.Color.fromCssColorString("#06131d");
          rec.viewer.scene.globe.baseColor = C.Color.fromCssColorString("#102431");
          rec.viewer.scene.highDynamicRange = true;
          if (rec.viewer.scene.postProcessStages && rec.viewer.scene.postProcessStages.fxaa) {
            rec.viewer.scene.postProcessStages.fxaa.enabled = true;
          }
        } catch (e2) {}
        rec.loading = false;
        rec.failed = false;
        rec.didAutoFit = false;
        rec.entities = Object.create(null);
        rec.entityKinds = Object.create(null);
        rec.shipModels = Object.create(null);
        rec.aircraftModels = Object.create(null);
        if (typeof ResizeObserver !== "undefined") {
          rec.resizeObserver = new ResizeObserver(function () { resizeViewer(rec); });
          rec.resizeObserver.observe(box);
        }
        defaultView(rec.viewer);
        window.setTimeout(function () {
          resizeViewer(rec);
          syncViewer(rec);
          if (rec.pendingFollowId) startFollowTarget(rec, rec.pendingFollowId);
        }, 80);
      } catch (error) {
        rec.loading = false;
        rec.failed = true;
        setError(rec, "Cesium-Viewer Fehler: " + (error && error.message ? error.message : "unbekannt"));
      }
    }).catch(function (error) {
      rec.loading = false;
      rec.failed = true;
      setError(rec, error && error.message ? error.message : "CesiumJS konnte nicht geladen werden");
    });
  }

  function resizeViewer(rec) {
    if (!rec) return;
    if (rec.map2d) {
      try { rec.map2d.invalidateSize({ pan: false }); } catch (e) {}
    }
    if (rec.viewer) {
      try { rec.viewer.resize(); } catch (e2) {}
      try { rec.viewer.scene.requestRender(); } catch (e3) {}
    }
  }

  function creditHtml(kind) {
    if (kind === "esri") return '<a href="https://www.esri.com/" target="_blank" rel="noopener">Powered by Esri</a> · Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community';
    if (kind === "topo") return '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap-Mitwirkende</a>, SRTM | Kartendarstellung © <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC-BY-SA</a>)';
    if (kind === "carto") return '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap-Mitwirkende</a> © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';
    if (kind === "seamark") return '<a href="https://www.openseamap.org/" target="_blank" rel="noopener">Seamarks © OpenSeaMap contributors</a>';
    return '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>';
  }
  function mapCredit(choice) {
    var cfg = BASEMAPS[choice] || BASEMAPS.osm;
    return creditHtml(cfg.credit || "osm");
  }

  function applyBaseMap2D(rec) {
    if (!rec || !rec.map2d || !window.L) return;
    var L = window.L;
    var choice = BASEMAPS[rec.prefs.baseMap] ? rec.prefs.baseMap : "osm";
    try {
      if (rec.map2dBaseLayer) rec.map2d.removeLayer(rec.map2dBaseLayer);
      if (rec.map2dOverlayLayer) rec.map2d.removeLayer(rec.map2dOverlayLayer);
      rec.map2dOverlayLayer = null;
      if (!baseMapAvailable(choice)) choice = "osm";
      var cfg = BASEMAPS[choice];
      rec.map2dBaseLayer = L.tileLayer(baseMapTileUrl(choice), {
        maxZoom: cfg.maxZoom,
        attribution: mapCredit(choice),
        updateWhenIdle: true,
        keepBuffer: 2
      }).addTo(rec.map2d);
      if (cfg.overlay) {
        rec.map2dOverlayLayer = L.tileLayer(cfg.overlay, {
          maxZoom: cfg.maxZoom,
          opacity: cfg.overlayAlpha !== undefined ? cfg.overlayAlpha : 0.9,
          attribution: creditHtml(cfg.overlayCredit || cfg.credit || "osm"),
          updateWhenIdle: true,
          keepBuffer: 2
        }).addTo(rec.map2d);
      }
    } catch (error) {
      showToast(rec, "Kartenebene konnte nicht geladen werden: " + (error && error.message ? error.message : "Fehler"));
    }
  }

  function applyBaseMap3D(rec) {
    if (!rec || !rec.viewer || !window.Cesium) return;
    var C = window.Cesium;
    var choice = BASEMAPS[rec.prefs.baseMap] && baseMapAvailable(rec.prefs.baseMap) ? rec.prefs.baseMap : "osm";
    var baseChoice = choice === "nautical" ? "osm" : choice;
    var cfg = BASEMAPS[baseChoice];
    try {
      var layers = rec.viewer.imageryLayers;
      layers.removeAll(true);
      layers.addImageryProvider(new C.UrlTemplateImageryProvider({
        url: baseMapTileUrl(baseChoice),
        credit: mapCredit(baseChoice),
        maximumLevel: cfg.maxZoom
      }));
      if (cfg.overlay) {
        layers.addImageryProvider(new C.UrlTemplateImageryProvider({
          url: cfg.overlay,
          credit: creditHtml(cfg.overlayCredit || cfg.credit || "osm"),
          maximumLevel: cfg.maxZoom
        })).alpha = cfg.overlayAlpha !== undefined ? cfg.overlayAlpha : 0.9;
      }
      rec.map2dBaseName = choice;
    } catch (error) {
      showToast(rec, "3D-Kartenebene konnte nicht geladen werden");
    }
  }

  function setBaseMap(rec, choice) {
    if (!rec) return;
    if (!BASEMAPS[choice] || !baseMapAvailable(choice)) choice = "osm";
    rec.prefs.baseMap = choice;
    savePrefs(rec);
    var select = q('[data-am-option="basemap"]', rec.win);
    if (select) select.value = rec.prefs.baseMap;
    applyBaseMap2D(rec);
    applyBaseMap3D(rec);
    Object.keys(rec.map2dTracks || {}).forEach(function (id) {
      styleTrack2D(rec.map2dTracks[id], rec);
    });
    if (rec.map2d) syncMap2D(rec);
    refreshAircraftContrast(rec);
  }

  function setMapError(rec, text) {
    var wait = rec && q(".dnx-am-map-wait", rec.win);
    if (wait) { wait.style.display = "block"; wait.textContent = text; }
    if (rec) { rec.mapFailed = true; setStatus(rec, "2D-Karte nicht verfügbar"); }
  }

  function createMap2D(rec) {
    if (!rec || !rec.win || !rec.win.isConnected || rec.map2d || rec.map2dLoading) return;
    rec.map2dLoading = true;
    loadLeaflet().then(function (L) {
      if (!rec.win || !rec.win.isConnected) return;
      var container = q(".dnx-am-map2d", rec.win);
      if (!container) return;
      try {
        rec.map2d = L.map(container, { zoomControl: true, attributionControl: true, preferCanvas: true, minZoom: 2, maxZoom: 19 });
        rec.map2d.setView([51.66, 6.97], 7);
        rec.map2dMarkers = Object.create(null);
        rec.map2dTracks = Object.create(null);
        rec.map2d.on("contextmenu", function (event) {
          if (event && event.originalEvent) event.originalEvent.preventDefault();
        });
        rec.map2dLoading = false;
        rec.mapFailed = false;
        applyBaseMap2D(rec);
    installMotionTicker(rec);
    applyWeatherLayers(rec);
    applyPositionRings(rec);
        if (typeof ResizeObserver !== "undefined") {
          rec.mapResizeObserver = new ResizeObserver(function () { resizeViewer(rec); });
          rec.mapResizeObserver.observe(container);
        }
        window.setTimeout(function () { resizeViewer(rec); syncMap2D(rec); }, 100);
      } catch (error) {
        rec.map2dLoading = false;
        setMapError(rec, "Leaflet-Karte Fehler: " + (error && error.message ? error.message : "unbekannt"));
      }
    }).catch(function (error) {
      rec.map2dLoading = false;
      setMapError(rec, error && error.message ? error.message : "Leaflet konnte nicht geladen werden");
    });
  }

  function colorFor(kind, record, C) {
    if (kind === "adsb") {
      if (record.emergency && record.emergency !== "NONE") return C.Color.fromCssColorString("#ff4d5b");
      if ((record.altitudeM || 0) < 1200) return C.Color.fromCssColorString("#ffd166");
      return C.Color.fromCssColorString("#57b7ff");
    }
    var modelKind = record.kindName || aisModelKind(record);
    var map = {
      cargo: "#3478f6", tanker: "#ff8b3d", passenger: "#b273ff",
      tug: "#ffd43b", fishing: "#21c77a", sail: "#f1f5f9",
      dredger: "#ff922b", hsc: "#21c9d4", pilot: "#ff7b35",
      sar: "#ff4545", patrol: "#9aa9b5", yacht: "#f4f6f8",
      generic: "#38c979", station: "#5aa7ff", aid: "#f5c542"
    };
    return C.Color.fromCssColorString(map[modelKind] || map.generic);
  }

  function recordLabel(kind, record) {
    if (kind === "adsb") return record.flight || record.aircraft || record.icao || record.id;
    if (record.isAid) return "AIS-Seezeichen · " + record.mmsi;
    if (record.isStation) return "AIS-Station · " + record.mmsi;
    var modelKind = record.kindName || aisModelKind(record);
    var classLabel = AIS_CLASS_LABELS[modelKind] || AIS_CLASS_LABELS.generic;
    return (record.name ? record.name : "MMSI " + record.mmsi) + " · " + classLabel;
  }

  function headingFor(kind, record) {
    var heading = kind === "adsb" ? asNumber(record.courseDeg) : asNumber(record.cogDeg, record.headingDeg);
    if (heading === null && record.track && record.track.length > 1) {
      var a = record.track[record.track.length - 2], b = record.track[record.track.length - 1];
      var p1 = Math.PI * a.lat / 180, p2 = Math.PI * b.lat / 180;
      var dl = Math.PI * (b.lon - a.lon) / 180;
      var y = Math.sin(dl) * Math.cos(p2);
      var x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
      heading = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
    return heading === null ? 0 : heading;
  }

  function makeOrientation(kind, record, position, C) {
    var heading = headingFor(kind, record);
    /* Entity/fallback models use +X-forward; realistic aircraft primitives are axis-corrected to that frame. */
    var offset = -90;
    var pitch = 0;
    if (kind === "adsb" && record.vspeedFpm !== null && record.vspeedFpm !== undefined) {
      var horizontal = (Number(record.speedKn) || 0) * 0.514444;
      var vertical = Number(record.vspeedFpm) * 0.00508;
      if (horizontal > 1) pitch = clamp(Math.atan2(vertical, horizontal), -0.22, 0.22);
    }
    return C.Transforms.headingPitchRollQuaternion(
      position,
      new C.HeadingPitchRoll(C.Math.toRadians(heading + offset), pitch, 0)
    );
  }

  function modelScale(kind, record) {
    if (kind === "adsb") return 1.25; /* retained Cesium Air fallback scale */
    var modelKind = record.kindName || aisModelKind(record);
    if (modelKind === "station" || modelKind === "aid") return 1;
    var base = MODEL_BASE_LENGTH[modelKind] || 75;
    return record.lengthM ? clamp(Number(record.lengthM) / base, 0.4, 3) : 1;
  }

  function applyAircraftContrast(rec, model, record, C) {
    if (!model || !C || !C.Color || !rec) return;
    var colors = trackContrast2D(rec.prefs && rec.prefs.baseMap);
    var locked = !!(record && rec.follow && !rec.follow.native && followTargetKind(rec) === "adsb" && rec.follow.id === String(record.id));
    var key = "material-v443:" + colors.color + (locked ? ":locked" : ":normal");
    if (model.__dnxContrastKey === key) return;
    model.color = C.Color.fromCssColorString("#ffffff");
    /* Preserve source material and lighting; contrast belongs to the edge,
       not an 88-percent flat tint that erases the aircraft's shape. */
    if (C.ColorBlendMode) model.colorBlendMode = C.ColorBlendMode.MIX;
    model.colorBlendAmount = colors.color === "#ffffff" ? 0.18 : 0.08;
    model.silhouetteColor = C.Color.fromCssColorString(locked ? "#ffd24a" : colors.color);
    model.silhouetteSize = locked ? 3 : 1.5;
    model.__dnxContrastKey = key;
  }
  function refreshAircraftContrast(rec) {
    var C = window.Cesium;
    if (!rec || !C) return;
    Object.keys(rec.aircraftModels || {}).forEach(function (id) {
      var entry = rec.aircraftModels[id];
      if (entry && entry.model) applyAircraftContrast(rec, entry.model, RECORDS.adsb[id.replace(/^adsb-/, "")], C);
    });
    Object.keys(rec.entities || {}).forEach(function (id) {
      if (id.indexOf("adsb-") !== 0) return;
      var entity = rec.entities[id];
      if (entity && entity.model) applyAircraftContrast(rec, entity.model, RECORDS.adsb[id.slice(5)], C);
      if (entity && entity.polyline) {
        var colors = trackColors(rec);
        var key = colors.color + colors.outline;
        if (entity.__trackContrastKey !== key) {
          entity.polyline.material = cesiumTrackMaterial("adsb", C, rec);
          entity.polyline.width = 7;
          entity.__trackContrastKey = key;
        }
      }
    });
    if (rec.viewer && rec.viewer.scene) rec.viewer.scene.requestRender();
  }

  function aircraftSizeFactor(rec) {
    var value = Number(rec && rec.prefs && rec.prefs.aircraftSize) || 1;
    return [1, 1.5, 2, 3].indexOf(value) >= 0 ? value : 1;
  }
  function aircraftTargetZoom(rec, record) {
    return Number(rec && rec.aircraftTargetZoom && record && rec.aircraftTargetZoom[String(record.id)]) || 1;
  }

  // A selected aircraft owns the wheel everywhere on this canvas. Change ONLY
  // its visual scale: no camera/frustum/terrain zoom, no other aircraft scaling.
  function zoomSelectedAircraft(rec, event) {
    var selected = rec && rec.selection;
    if (!selected || selected.kind !== "adsb") return false;
    event.preventDefault(); event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    var record = RECORDS.adsb[selected.id];
    if (!record) return true; // stale selection must not leak a terrain zoom
    var delta = Number(event.deltaY);
    if (!isFinite(delta)) return true;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= (rec.viewer.scene.canvas.clientHeight || 800);
    rec.aircraftTargetZoom = rec.aircraftTargetZoom || Object.create(null);
    rec.aircraftTargetZoom[String(selected.id)] = clamp(aircraftTargetZoom(rec, record) *
      Math.exp(-clamp(delta, -1200, 1200) * 0.0015), 0.1, 20);
    var factor = aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record);
    var key = "adsb-" + selected.id;
    var entry = rec.aircraftModels && rec.aircraftModels[key];
    if (entry && entry.model) {
      entry.model.modelMatrix = aircraftModelMatrix(rec, record, window.Cesium,
        livePositionFor(rec, "adsb", record, window.Cesium));
      entry.model.minimumPixelSize = 50 * factor;
    }
    var entity = rec.entities && rec.entities[key];
    if (entity && entity.model) {
      entity.model.scale = 1.25 * factor;
      entity.model.minimumPixelSize = 50 * factor;
    }
    try { rec.viewer.scene.requestRender(); } catch (e) {}
    return true;
  }

  function aircraftDistanceZoom(meters) {
    return meters <= 100 ? 17 : meters <= 250 ? 16 : meters <= 500 ? 15 : meters <= 1000 ? 14 : 12;
  }
  function setAircraftSize(rec, value) {
    if ([1, 1.5, 2, 3].indexOf(Number(value)) < 0) return;
    rec.prefs.aircraftSize = Number(value);
    savePrefs(rec);
    syncMap2D(rec); syncViewer(rec);
  }
  function setAircraftDistance(rec, id, value) {
    var meters = Number(value);
    if ([100, 250, 500, 1000, 3000].indexOf(meters) < 0) return;
    var record = RECORDS.adsb[id];
    if (!record) return;
    rec.prefs.aircraftDistance = meters;
    savePrefs(rec);
    var ll = extrapolate2d(record);
    if (rec.map2d) rec.map2d.setView([ll.lat, ll.lon], aircraftDistanceZoom(meters), { animate: true });
    if (!rec.viewer || !window.Cesium) return;
    var C = window.Cesium;
    if (rec.follow && rec.follow.id === String(id) && followTargetKind(rec) === "adsb") {
      rec.follow.range = Math.max(0.1, (meters - 12) / aircraftModelLength(record));
      updateFollowCamera(rec, record, 0);
    } else {
      if (rec.follow) stopFollow(rec, false);
      var pos = livePositionFor(rec, "adsb", record, C);
      rec.viewer.camera.flyToBoundingSphere(new C.BoundingSphere(pos, 1), {
        duration: 0.6,
        offset: new C.HeadingPitchRange(C.Math.toRadians(headingFor("adsb", record)), C.Math.toRadians(-25), meters)
      });
    }
  }

  function aircraftModelLength(record) {
    var key = adsbModelAssetKey(record);
    return AIRCRAFT_MODEL_LENGTHS[key] || 32;
  }

  function aircraftModelScale(record) {
    var key = adsbModelAssetKey(record);
    return AIRCRAFT_MODEL_SCALES[key] || 1;
  }

  function aircraftModelForwardAxis(record) {
    var key = adsbModelAssetKey(record);
    return AIRCRAFT_MODEL_FORWARD_AXES[key] || "X";
  }

  function aircraftModelAssetFile(record) {
    var key = adsbModelAssetKey(record);
    return AIRCRAFT_REALISTIC_MODEL_FILES[key] || null;
  }

  function followVisualHeadingFor(kind, record, offsetDeg) {
    return normalizeAngleDegrees(headingFor(kind, record) + (Number(offsetDeg) || 0));
  }

  function followVisualHeading(record, offsetDeg) {
    return followVisualHeadingFor("ais", record, offsetDeg);
  }

  function displayOrientation(rec, kind, record, position, C, hasFallbackModel) {
    var follow = rec && rec.follow;
    var followKindValue = follow && (follow.kind || (rec.spec && rec.spec.key));
    if (hasFallbackModel && follow && followKindValue === kind &&
        follow.id === String(record.id) && follow.modelOffsetDeg) {
      var visualRecord = Object.assign({}, record);
      var visualHeading = followVisualHeadingFor(kind, record, follow.modelOffsetDeg);
      if (kind === "ais") {
        visualRecord.cogDeg = visualHeading;
        visualRecord.headingDeg = null;
      } else {
        visualRecord.courseDeg = visualHeading;
      }
      return makeOrientation(kind, visualRecord, position, C);
    }
    return makeOrientation(kind, record, position, C);
  }

  function positionFor(kind, record, C) {
    var h = 0;
    if (kind === "adsb") h = Math.max(8, Number(record.altitudeM) || 0);
    else h = 5 * modelScale(kind, record);
    return C.Cartesian3.fromDegrees(record.lon, record.lat, h);
  }

  function aisModelMatrix(record, C, headingOffset, livePos) {
    var dims = aisShipDimensions(record);
    var anchor = livePos || C.Cartesian3.fromDegrees(record.lon, record.lat, 0);
    var heading = headingFor("ais", record) + (Number(headingOffset) || 0);
    /* The licensed GLBs are bow-forward on +X; use the same Cesium axis convention as their source viewer. */
    var hpr = new C.HeadingPitchRoll(C.Math.toRadians(heading - 90), 0, 0);
    var frame = C.Transforms.headingPitchRollToFixedFrame(anchor, hpr, C.Ellipsoid.WGS84);
    return C.Matrix4.multiplyByScale(frame,
      new C.Cartesian3(dims.length, dims.beam, dims.length), new C.Matrix4());
  }

  function removeShipModel(rec, id) {
    if (!rec || !rec.shipModels) return;
    var entry = rec.shipModels[id];
    if (!entry) return;
    entry.cancelled = true;
    if (entry.model && rec.viewer && rec.viewer.scene) {
      try { rec.viewer.scene.primitives.remove(entry.model); } catch (e) {}
    }
    delete rec.shipModels[id];
  }

  function useLegacyAisModel(rec, entity, record) {
    if (!entity || !record) return;
    var C = window.Cesium;
    var modelKind = record.kindName || aisModelKind(record);
    entity.model = {
      uri: APP_ROOT + "/models/ais/" + (AIS_MODELS[modelKind] || "generic") + ".glb",
      scale: modelScale("ais", record),
      minimumPixelSize: 64,
      maximumScale: 30000,
      runAnimations: false,
      shadows: window.Cesium.ShadowMode.ENABLED,
      imageBasedLightingFactor: new window.Cesium.Cartesian2(1.15, 1.0),
      color: window.Cesium.Color.WHITE,
      silhouetteSize: 0
    };
    if (C) entity.orientation = displayOrientation(rec, "ais", record, positionFor("ais", record, C), C, true);
  }

  function ensureShipModel(rec, entity, record) {
    if (!rec || !rec.viewer || !window.Cesium || !record) return;
    var C = window.Cesium;
    rec.shipModels = rec.shipModels || Object.create(null);
    var id = "ais-" + String(record.id);
    var key = aisModelAssetKey(record);
    if (!key || !AIS_REALISTIC_MODEL_FILES[key]) {
      removeShipModel(rec, id);
      if (entity && entity.point) entity.point.show = true;
      return;
    }
    var entry = rec.shipModels[id];
    if (entry && entry.key !== key) {
      removeShipModel(rec, id);
      if (entity && entity.model) entity.model = undefined;
      if (entity && entity.point) entity.point.show = true;
      entry = null;
    }
    var offset = rec.follow && rec.follow.id === String(record.id) ? rec.follow.modelOffsetDeg : 0;
    var modelMatrix = aisModelMatrix(record, C, offset, livePositionFor(rec, "ais", record, C));
    if (entry) {
      entry.modelMatrix = modelMatrix;
      if (entry.model) {
        entry.model.modelMatrix = modelMatrix;
        if (entity && entity.model) entity.model = undefined;
        if (entity && entity.point) entity.point.show = false;
      } else if (entry.failed && entity && !entity.model) {
        useLegacyAisModel(rec, entity, record);
      }
      return;
    }
    entry = { key: key, model: null, loading: true, failed: false, cancelled: false, modelMatrix: modelMatrix };
    rec.shipModels[id] = entry;
    var url = APP_ROOT + "/models/ais-realistic/" + AIS_REALISTIC_MODEL_FILES[key];
    if (!C.Model || typeof C.Model.fromGltfAsync !== "function") {
      entry.loading = false;
      entry.failed = true;
      if (entity) useLegacyAisModel(rec, entity, record);
      return;
    }
    var loadPromise;
    try {
      loadPromise = C.Model.fromGltfAsync({
        url: url,
        modelMatrix: modelMatrix,
        id: { id: id },
        upAxis: C.Axis.Y,
        forwardAxis: C.Axis.X,
        minimumPixelSize: 64,
        maximumScale: 30000,
        shadows: C.ShadowMode.ENABLED,
        runAnimations: false
      });
    } catch (loadError) {
      entry.loading = false;
      entry.failed = true;
      if (entity) useLegacyAisModel(rec, entity, record);
      try { console.warn("[DNX AirMarine 3D] Cesium-Modellinitialisierung fehlgeschlagen", key, loadError); } catch (e) {}
      return;
    }
    loadPromise.then(function (model) {
      if (!rec.viewer || !rec.viewer.scene || entry.cancelled || rec.shipModels[id] !== entry) {
        try { model.destroy(); } catch (e) {}
        return;
      }
      try {
        if (model.imageBasedLighting && model.imageBasedLighting.imageBasedLightingFactor !== undefined) {
          model.imageBasedLighting.imageBasedLightingFactor = new C.Cartesian2(1.15, 1.0);
        }
        model.modelMatrix = entry.modelMatrix;
        rec.viewer.scene.primitives.add(model);
        entry.model = model;
        entry.loading = false;
        var liveEntity = rec.entities[id];
        if (liveEntity) {
          if (liveEntity.model) liveEntity.model = undefined;
          if (liveEntity.point) liveEntity.point.show = false;
        }
        rec.viewer.scene.requestRender();
      } catch (error) {
        try { model.destroy(); } catch (e2) {}
        entry.loading = false;
        entry.failed = true;
        var failedEntity = rec.entities[id];
        if (failedEntity) useLegacyAisModel(rec, failedEntity, (RECORDS.ais || {})[record.id] || record);
        try { console.warn("[DNX AirMarine 3D] Realistisches AIS-Modell konnte nicht eingebunden werden", key, error); } catch (e3) {}
      }
    }).catch(function (error) {
      if (entry.cancelled || rec.shipModels[id] !== entry) return;
      entry.loading = false;
      entry.failed = true;
      var failedEntity = rec.entities[id];
      if (failedEntity) useLegacyAisModel(rec, failedEntity, (RECORDS.ais || {})[record.id] || record);
      try { console.warn("[DNX AirMarine 3D] Realistisches AIS-Modell konnte nicht geladen werden", key, error); } catch (e2) {}
    });
  }

  function aircraftModelMatrix(rec, record, C, livePos) {
    var follow = rec && rec.follow;
    var offset = follow && (follow.kind || (rec.spec && rec.spec.key)) === "adsb" &&
      follow.id === String(record.id) ? follow.modelOffsetDeg : 0;
    var position = livePos || positionFor("adsb", record, C);
    var heading = followVisualHeadingFor("adsb", record, offset);
    var pitch = 0;
    if (record.vspeedFpm !== null && record.vspeedFpm !== undefined) {
      var horizontal = (Number(record.speedKn) || 0) * 0.514444;
      var vertical = Number(record.vspeedFpm) * 0.00508;
      if (horizontal > 1) pitch = clamp(Math.atan2(vertical, horizontal), -0.22, 0.22);
    }
    /* Cesium's per-model forwardAxis correction maps +X or +Z source assets into this +X-forward frame. */
    var hpr = new C.HeadingPitchRoll(C.Math.toRadians(heading - 90), pitch, 0);
    var frame = C.Transforms.headingPitchRollToFixedFrame(position, hpr, C.Ellipsoid.WGS84);
    var scale = aircraftModelScale(record) * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record);
    return C.Matrix4.multiplyByScale(frame,
      new C.Cartesian3(scale, scale, scale), new C.Matrix4());
  }

  function removeAircraftModel(rec, id) {
    if (!rec || !rec.aircraftModels) return;
    var entry = rec.aircraftModels[id];
    if (!entry) return;
    entry.cancelled = true;
    if (entry.model && rec.viewer && rec.viewer.scene) {
      try { rec.viewer.scene.primitives.remove(entry.model); } catch (e) {}
    }
    delete rec.aircraftModels[id];
  }

  function useLegacyAircraftModel(rec, entity, record) {
    if (!entity || !record || !window.Cesium) return;
    var C = window.Cesium;
    entity.model = {
      uri: AIRCRAFT_MODEL,
      scale: 1.25 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record),
      minimumPixelSize: 50 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record),
      maximumScale: 12000,
      runAnimations: false,
      shadows: C.ShadowMode.ENABLED,
      imageBasedLightingFactor: new C.Cartesian2(1.15, 1.0),
      color: C.Color.WHITE,
      silhouetteSize: 0
    };
    applyAircraftContrast(rec, entity.model, record, C);
    entity.orientation = displayOrientation(rec, "adsb", record, positionFor("adsb", record, C), C, true);
    if (entity.point) entity.point.show = true;
  }

  function ensureAircraftModel(rec, entity, record) {
    if (!rec || !rec.viewer || !window.Cesium || !record) return;
    var C = window.Cesium;
    rec.aircraftModels = rec.aircraftModels || Object.create(null);
    var id = "adsb-" + String(record.id);
    var key = adsbModelAssetKey(record);
    var modelFile = aircraftModelAssetFile(record);
    if (!key || !modelFile) {
      removeAircraftModel(rec, id);
      if (entity && !entity.model) useLegacyAircraftModel(rec, entity, record);
      if (entity && entity.point) entity.point.show = true;
      return;
    }
    var entry = rec.aircraftModels[id];
    if (entry && entry.key !== key) {
      removeAircraftModel(rec, id);
      if (entity) useLegacyAircraftModel(rec, entity, record);
      entry = null;
    }
    var modelMatrix = aircraftModelMatrix(rec, record, C, livePositionFor(rec, "adsb", record, C));
    if (entry) {
      entry.modelMatrix = modelMatrix;
      if (entry.model) {
        entry.model.modelMatrix = modelMatrix;
        entry.model.minimumPixelSize = 50 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record);
        if (entity && entity.model) entity.model = undefined;
        if (entity && entity.point) entity.point.show = true;
      } else if (entry.failed && entity && !entity.model) {
        useLegacyAircraftModel(rec, entity, record);
      }
      return;
    }
    entry = { key: key, model: null, loading: true, failed: false, cancelled: false, modelMatrix: modelMatrix };
    rec.aircraftModels[id] = entry;
    if (entity && !entity.model) useLegacyAircraftModel(rec, entity, record);
    var url = APP_ROOT + "/models/adsb-realistic/" + modelFile;
    if (!C.Model || typeof C.Model.fromGltfAsync !== "function") {
      entry.loading = false;
      entry.failed = true;
      if (entity) useLegacyAircraftModel(rec, entity, record);
      return;
    }
    var loadPromise;
    try {
      loadPromise = C.Model.fromGltfAsync({
        url: url,
        modelMatrix: modelMatrix,
        id: { id: id },
        upAxis: C.Axis.Y,
        forwardAxis: C.Axis[aircraftModelForwardAxis(record)] || C.Axis.X,
        minimumPixelSize: 50 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record),
        maximumScale: 30000,
        shadows: C.ShadowMode.ENABLED,
        runAnimations: false
      });
    } catch (loadError) {
      entry.loading = false;
      entry.failed = true;
      if (entity) useLegacyAircraftModel(rec, entity, record);
      try { console.warn("[DNX AirMarine 3D] Flugzeug-Modellinitialisierung fehlgeschlagen", key, loadError); } catch (e) {}
      return;
    }
    loadPromise.then(function (model) {
      if (!rec.viewer || !rec.viewer.scene || entry.cancelled || rec.aircraftModels[id] !== entry) {
        try { model.destroy(); } catch (e) {}
        return;
      }
      try {
        if (model.imageBasedLighting && model.imageBasedLighting.imageBasedLightingFactor !== undefined) {
          model.imageBasedLighting.imageBasedLightingFactor = new C.Cartesian2(1.15, 1.0);
        }
        model.modelMatrix = entry.modelMatrix;
        rec.viewer.scene.primitives.add(model);
        entry.model = model;
        applyAircraftContrast(rec, model, record, C);
        entry.loading = false;
        var liveEntity = rec.entities[id];
        if (liveEntity) {
          if (liveEntity.model) liveEntity.model = undefined;
          if (liveEntity.point) liveEntity.point.show = true;
        }
        rec.viewer.scene.requestRender();
      } catch (error) {
        try { model.destroy(); } catch (e2) {}
        entry.loading = false;
        entry.failed = true;
        var failedEntity = rec.entities[id];
        if (failedEntity) useLegacyAircraftModel(rec, failedEntity, (RECORDS.adsb || {})[record.id] || record);
        try { console.warn("[DNX AirMarine 3D] Realistisches ADS-B-Modell konnte nicht eingebunden werden", key, error); } catch (e3) {}
      }
    }).catch(function (error) {
      if (entry.cancelled || rec.aircraftModels[id] !== entry) return;
      entry.loading = false;
      entry.failed = true;
      var failedEntity = rec.entities[id];
      if (failedEntity) useLegacyAircraftModel(rec, failedEntity, (RECORDS.adsb || {})[record.id] || record);
      try { console.warn("[DNX AirMarine 3D] Realistisches ADS-B-Modell konnte nicht geladen werden", key, error); } catch (e2) {}
    });
  }

  /* ---- v4.15: Whittaker-Eilers track smoothing (display only, telemetry untouched) ---- */
  function whittaker(values, lambda) {
    var n = values.length;
    if (n < 5 || !(lambda > 0)) return values;
    var diag = new Array(n), l1 = new Array(n), l2 = new Array(n), i, j, a, b;
    for (i = 0; i < n; i++) { diag[i] = 1; l1[i] = 0; l2[i] = 0; }
    for (j = 0; j < n - 2; j++) {
      var idx = [j, j + 1, j + 2], co = [1, -2, 1];
      for (a = 0; a < 3; a++) for (b = 0; b < 3; b++) {
        var ia = idx[a], ib = idx[b], v = lambda * co[a] * co[b];
        if (ia === ib) diag[ia] += v;
        else if (ib === ia + 1) l1[ia] += v;
        else if (ib === ia + 2) l2[ia] += v;
      }
    }
    /* Cholesky of the pentadiagonal SPD matrix: L has diag d, off1 e, off2 f */
    var d = new Array(n), e = new Array(n), f = new Array(n);
    d[0] = Math.sqrt(diag[0]);
    e[0] = 0; f[0] = 0;
    e[1] = l1[0] / d[0];
    f[1] = 0;
    d[1] = Math.sqrt(Math.max(diag[1] - e[1] * e[1], 1e-9));
    for (i = 2; i < n; i++) {
      f[i] = l2[i - 2] / d[i - 2];
      e[i] = (l1[i - 1] - f[i] * e[i - 1]) / d[i - 1];
      d[i] = Math.sqrt(Math.max(diag[i] - f[i] * f[i] - e[i] * e[i], 1e-9));
    }
    var y = new Array(n), x = new Array(n);
    y[0] = values[0] / d[0];
    y[1] = (values[1] - e[1] * y[0]) / d[1];
    for (i = 2; i < n; i++) y[i] = (values[i] - f[i] * y[i - 2] - e[i] * y[i - 1]) / d[i];
    x[n - 1] = y[n - 1] / d[n - 1];
    x[n - 2] = (y[n - 2] - e[n - 1] * x[n - 1]) / d[n - 2];
    for (i = n - 3; i >= 0; i--) x[i] = (y[i] - e[i + 1] * x[i + 1] - f[i + 2] * x[i + 2]) / d[i];
    return x;
  }
  function smoothTrackPoints(points, lambda) {
    if (!points || points.length < 5 || !(lambda > 0)) return points;
    var lats = whittaker(points.map(function (p) { return Number(p.lat) || 0; }), lambda);
    var lons = whittaker(points.map(function (p) { return Number(p.lon) || 0; }), lambda);
    var alts = whittaker(points.map(function (p) { return Number(p.altitude) || 0; }), lambda);
    return points.map(function (p, i) {
      return { lat: lats[i], lon: lons[i], altitude: alts[i] };
    });
  }
  function trackShow(rec, record) {
    if (!rec.prefs || !rec.prefs.tracks) return false;
    var mode = rec.prefs.groundTracks || "all";
    if (mode === "off") return false;
    if (mode === "selected") {
      var target = rec.selection || rec.follow;
      return !!(target && target.id === String(record.id) && (!target.kind || target.kind === record.kind));
    }
    return true;
  }
  function trackDisplayPoints(record) {
    var points = (record.track || []).slice();
    if (!points.length && validPosition(record.lat, record.lon)) points.push({lat:record.lat,lon:record.lon,altitude:record.altitudeM || 0});
    var display = extrapolate2d(record), last = points[points.length - 1];
    if (last && (Math.abs(last.lat-display.lat)>0.00001 || Math.abs(last.lon-display.lon)>0.00001)) {
      points.push({lat:display.lat,lon:display.lon,altitude:record.altitudeM || 0,predicted:true});
    }
    return points;
  }
  function trackColors(rec) {
    var automatic = trackContrast2D(rec && rec.prefs && rec.prefs.baseMap);
    var color = rec && rec.prefs && rec.prefs.trackColor;
    if (!/^#[0-9a-f]{6}$/i.test(color || "")) return automatic;
    var rgb=parseInt(color.slice(1),16);
    var brightness=(((rgb>>16)&255)*299+((rgb>>8)&255)*587+(rgb&255)*114)/1000;
    return {color:color,outline:brightness>145?"#101820":"#ffffff"};
  }
  function applyTrackSettings(rec) {
    savePrefs(rec);
    if (rec.map2d) syncMap2D(rec);
    if (rec.viewer && window.Cesium) {
      var C=window.Cesium,kind=rec.spec.key;
      Object.keys(rec.entities || {}).forEach(function(id){
        var record=(RECORDS[kind] || {})[id.replace(kind+"-","")],entity=rec.entities[id];
        if (record && entity && entity.polyline) {
          entity.polyline.positions=trackPositions(kind,record,C);
          entity.polyline.show=trackShow(rec,record)&&trackDisplayPoints(record).length>=2;
          entity.polyline.material=cesiumTrackMaterial(kind,C,rec);
        }
      });
      rec.viewer.scene.requestRender();
    }
    var checkbox=rec.win && q('[data-am-option="tracks"]',rec.win);
    if (checkbox) checkbox.checked=!!rec.prefs.tracks;
  }
  function trackPositions(kind, record, C) {
    var points = trackDisplayPoints(record);
    var prefsRec = WINDOWS[kind], prefs = prefsRec && prefsRec.prefs ? prefsRec.prefs : {};
    if ((Number(prefs.smoothWindow) || 0) > 0 && points.length >= Math.max(5, Number(prefs.smoothWindow) || 5)) {
      points = smoothTrackPoints(points, Number(prefs.smoothLambda) || 1);
    }
    var result = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var h = kind === "adsb" ? Math.max(8, Number(p.altitude) || 0) : 2;
      result.push(C.Cartesian3.fromDegrees(p.lon, p.lat, h));
    }
    return result;
  }

  function cesiumTrackMaterial(kind, C, rec) {
    if ((kind === "adsb" || (rec && rec.prefs.trackColor && rec.prefs.trackColor !== "auto")) && C.PolylineOutlineMaterialProperty) {
      var colors = trackColors(rec);
      return new C.PolylineOutlineMaterialProperty({
        color: C.Color.fromCssColorString(colors.color),
        outlineColor: C.Color.fromCssColorString(colors.outline),
        outlineWidth: 2
      });
    }
    return new C.PolylineGlowMaterialProperty({
      glowPower: 0.22,
      color: C.Color.fromCssColorString(trackColorCss(kind))
    });
  }

  function sampledPositionFor(record, C) {
    if (!record || !C || typeof C.SampledPositionProperty !== "function") return null;
    if (!record.__posProp) {
      try {
        var prop = new C.SampledPositionProperty();
        if (C.LinearApproximation) prop.setInterpolationOptions({ interpolationAlgorithm: C.LinearApproximation });
        if (C.ExtrapolationType) {
          prop.backwardExtrapolationType = C.ExtrapolationType.HOLD;
          /* HOLD first: with a single sample EXTRAPOLATE has no velocity and the
             entity would not render. Upgraded to EXTRAPOLATE after the 2nd sample. */
          prop.forwardExtrapolationType = C.ExtrapolationType.HOLD;
        }
        record.__posProp = prop;
        record.__posSamples = 0;
        record.__lastSampleKey = "";
      } catch (e) { return null; }
    }
    return record.__posProp;
  }

  function addPositionSample(record, pos, C) {
    var prop = sampledPositionFor(record, C);
    if (!prop) return null;
    var ms = Number(record.lastPositionAt) || Number(record.lastSeen) || now();
    try {
      /* v4.17: ONLY real horizontal movement may add a sample. Repeated list
         broadcasts and altitude jitter carry the same position at newer
         timestamps; sampling them would zero the velocity of the last two
         samples and freeze the glide — the targets would never travel from
         A to B. Same ~3 m threshold as appendTrack. */
      var lastPos = record.__lastSamplePos;
      var moved = !lastPos ||
        Math.abs(lastPos.lat - record.lat) > 0.00003 ||
        Math.abs(lastPos.lon - record.lon) > 0.00003;
      if (moved) {
        prop.addSample(C.JulianDate.fromDate(new Date(ms)), pos);
        record.__lastSamplePos = { lat: record.lat, lon: record.lon };
        record.__lastSampleMs = ms;
        record.__posSamples = (record.__posSamples || 0) + 1;
        /* SDRangel semantics: extrapolate the glide only once the target has
           demonstrably moved, and only for a bounded window. */
        if (record.__posSamples >= 2 && C.ExtrapolationType) {
          prop.forwardExtrapolationType = C.ExtrapolationType.EXTRAPOLATE;
          prop.forwardExtrapolationDuration = 60;
        }
      }
    } catch (e) {}
    return prop;
  }

  function livePositionFor(rec, kind, record, C) {
    /* One display trajectory for Leaflet, visible GLBs and pursuit camera.
       Do not depend on entity SampledPositionProperty evaluation for primitives. */
    if (record && record.__motion2d && C && C.Cartesian3 &&
        typeof C.Cartesian3.fromDegrees === "function") {
      var ll = extrapolate2d(record);
      var height = kind === "adsb" ? Math.max(8, Number(record.altitudeM) || 0) : 5 * modelScale(kind, record);
      return C.Cartesian3.fromDegrees(ll.lon, ll.lat, height);
    }
    if (rec && rec.entities && record && C) {
      var entity = rec.entities[kind + "-" + record.id];
      if (entity && entity.position && typeof entity.position.getValue === "function") {
        try {
          var value = entity.position.getValue(C.JulianDate.fromDate(new Date()));
          if (value && isFinite(value.x) && isFinite(value.y) && isFinite(value.z)) return value;
        } catch (e) {}
      }
    }
    return positionFor(kind, record, C);
  }

  /* ---- v4.15: layers & display (SDRangel map feature parity) ---- */
  function layersPanelHtml() {
    function opt(value, text, current) {
      return '<option value="' + value + '"' + (String(current) === String(value) ? " selected" : "") + ">" + text + "</option>";
    }
    return '<div data-am-layers hidden style="position:absolute;z-index:60;right:10px;top:78px;width:330px;max-height:70vh;overflow:auto;background:rgba(11,22,34,0.97);border:1px solid #243447;border-radius:10px;padding:10px 12px;font:12px/1.55 \'Segoe UI\',Arial,sans-serif;color:#dce7f1;box-shadow:0 12px 32px rgba(0,0,0,0.5)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 6px"><b>Ebenen &amp; Darstellung</b>' +
      '<button type="button" data-am-action="layers-close" title="Schließen" style="background:#16283a;border:1px solid #2c4258;border-radius:6px;color:#dce7f1;cursor:pointer;padding:1px 8px">×</button></div>' +
      '<div style="margin:0 0 6px"><b>Globus</b><br>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="sunLight"> Sonnenlicht</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="terrainLighting"> Tag/Nacht</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="buildings"> 3D-Gebäude</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="terrain"> 3D-Gelände</label></div>' +
      '<div style="margin:0 0 6px"><b>Grafik</b><br>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="fxaa"> FXAA</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0">MSAA <select data-am-layer="msaa" style="background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px">' + opt(1, "Aus", 1) + opt(2, "2×", 2) + opt(4, "4×", 4) + '</select></label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0">Labels <input type="range" data-am-layer="labelScale" min="0.5" max="1.5" step="0.1" style="width:80px;vertical-align:middle"></label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="hdr"> HDR</label></div>' +
      '<div style="margin:0 0 6px"><b>Karte</b><br>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="railways"> Bahnstrecken</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="seamarks"> Seekarten-Signale</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="posRings"> Standort &amp; Ringe</label></div>' +
      '<div style="margin:0 0 6px"><b>Wetter</b><br>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="rain"> Regen-Radar</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="clouds"> Wolken</label>' +
      '<label style="display:inline-block;margin:2px 10px 2px 0"><input type="checkbox" data-am-layer="nasa"> NASA-Satellitenbild</label></div>' +
      '<div style="margin:0 0 6px"><b>Spuren</b><br>' +
      '<select data-am-layer="groundTracks" style="background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px;margin:2px 8px 2px 0">' + opt("all", "Alle Bodenspuren", "all") + opt("selected", "Nur Folgeziel", "selected") + opt("off", "Keine", "off") + '</select>' +
      '<label style="margin:2px 8px 2px 0">Glättung <select data-am-layer="smoothWindow" style="background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px">' + opt(0, "Aus", 0) + opt(5, "5 Punkte", 5) + opt(10, "10 Punkte", 10) + opt(20, "20 Punkte", 20) + '</select></label>' +
      '<label style="margin:2px 0">λ <input type="number" data-am-layer="smoothLambda" min="0.1" max="20" step="0.1" style="width:52px;background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px"></label></div>' +
      '<div style="margin:0 0 2px"><b>Filter</b><br>' +
      '<label style="margin:2px 8px 2px 0">Name <input type="text" data-am-layer="filterName" placeholder="z. B. DLH|A320" style="width:120px;background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px"></label>' +
      '<label style="margin:2px 0">Umkreis (km) <input type="number" data-am-layer="filterDistance" min="0" step="10" style="width:64px;background:#16283a;color:#dce7f1;border:1px solid #2c4258;border-radius:4px"></label></div>' +
      '</div>';
  }
  function toggleLayersPanel(rec) {
    var panel = q("[data-am-layers]", rec.win);
    if (!panel) return;
    if (panel.hidden) {
      syncLayerControls(rec);
      panel.hidden = false;
    } else panel.hidden = true;
  }
  function syncLayerControls(rec) {
    if (!rec || !rec.win) return;
    var names = ["sunLight", "terrainLighting", "buildings", "terrain", "fxaa", "msaa", "labelScale", "hdr",
      "rain", "clouds", "nasa", "railways", "seamarks", "posRings",
      "groundTracks", "smoothWindow", "smoothLambda", "filterName", "filterDistance"];
    names.forEach(function (name) {
      var el = q('[data-am-layer="' + name + '"]', rec.win);
      if (!el) return;
      if (el.type === "checkbox") el.checked = !!rec.prefs[name];
      else el.value = String(rec.prefs[name] !== undefined ? rec.prefs[name] : "");
    });
  }
  function applyLayerOption(rec, name, el) {
    if (!rec || !rec.prefs || !el) return;
    var value;
    if (el.type === "checkbox") value = !!el.checked;
    else if (name === "msaa") value = [1, 2, 4].indexOf(Number(el.value)) >= 0 ? Number(el.value) : 1;
    else if (name === "labelScale" || name === "smoothWindow" || name === "smoothLambda" ||
             name === "filterDistance" || name === "nasaOpacity") value = Number(el.value) || 0;
    else value = el.value;
    rec.prefs[name] = value;
    savePrefs(rec);
    applyDisplayPrefs(rec);
    applyWeatherLayers(rec);
    applyPositionRings(rec);
    scheduleSync(rec.spec.key);
    updateWindowStatus(rec.spec.key);
  }

  function applyDisplayPrefs(rec) {
    if (!rec || !rec.viewer || !window.Cesium) return;
    var C = window.Cesium, scene = rec.viewer.scene;
    try {
      scene.globe.enableLighting = !!(rec.prefs.terrainLighting);
      if (rec.prefs.sunLight && C.SunLight) scene.light = new C.SunLight();
      else if (C.DirectionalLight) scene.light = new C.DirectionalLight({ direction: new C.Cartesian3(0.5, 0.6, -0.6), intensity: 2.2 });
    } catch (e) {}
    try {
      if (scene.postProcessStages && scene.postProcessStages.fxaa) {
        scene.postProcessStages.fxaa.enabled = !!rec.prefs.fxaa;
      }
    } catch (e) {}
    try {
      var msaa = [1, 2, 4].indexOf(Number(rec.prefs.msaa)) >= 0 ? Number(rec.prefs.msaa) : 1;
      if (scene.msaaSamples !== undefined) scene.msaaSamples = msaa;
    } catch (e) {}
    try {
      if (scene.highDynamicRange !== undefined) scene.highDynamicRange = !!rec.prefs.hdr;
    } catch (e) {}
    try {
      Object.keys(rec.entities || {}).forEach(function (id) {
        var entity = rec.entities[id];
        if (entity && entity.label) entity.label.scale = Number(rec.prefs.labelScale) || 1;
      });
    } catch (e) {}
    /* terrain */
    try {
      if (rec.prefs.terrain && C.CesiumTerrainProvider && C.CesiumTerrainProvider.fromIonAssetId) {
        C.CesiumTerrainProvider.fromIonAssetId(1).then(function (tp) {
          if (rec.viewer && !(rec.viewer.isDestroyed && rec.viewer.isDestroyed())) rec.viewer.terrainProvider = tp;
        }).catch(function () { showToast(rec, "3D-Gelände nicht verfügbar (Cesium Ion)."); });
      } else {
        rec.viewer.terrainProvider = new C.EllipsoidTerrainProvider();
      }
    } catch (e) {}
    /* OSM buildings */
    try {
      if (rec.osmBuildings) { scene.primitives.remove(rec.osmBuildings); rec.osmBuildings = null; }
      if (rec.prefs.buildings && C.createOsmBuildingsAsync) {
        C.createOsmBuildingsAsync().then(function (tileset) {
          if (!rec.viewer || (rec.viewer.isDestroyed && rec.viewer.isDestroyed())) return;
          rec.osmBuildings = rec.viewer.scene.primitives.add(tileset);
        }).catch(function () { showToast(rec, "3D-Gebäude nicht verfügbar (Cesium Ion)."); });
      }
    } catch (e) {}
  }

  /* ---- v4.15: weather overlays (RainViewer radar/satellite, NASA GIBS) ---- */
  var GIBS_LAYERS = {
    nasa: "MODIS_Terra_CorrectedReflectance_TrueColor"
  };
  function gibsUrl(layerId) {
    var d = new Date(Date.now() - 86400000);
    var stamp = d.toISOString().slice(0, 10);
    return "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/" + layerId +
      "/default/" + stamp + "/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg";
  }
  function rainviewerRefresh(rec) {
    fetch("https://api.rainviewer.com/public/weather-maps.json").then(function (r) { return r.json(); }).then(function (data) {
      window.__dnxRainFrames = {
        host: data.host || "https://tilecache.rainviewer.com",
        radar: ((data.radar && data.radar.past) || []).concat((data.radar && data.radar.nowcast) || []),
        satellite: (data.satellite && data.satellite.infrared) || []
      };
      applyWeatherLayers(rec);
    }).catch(function () {});
  }
  function rainRadarUrl(frame, host) {
    return (host || "https://tilecache.rainviewer.com") + frame.path + "/256/{z}/{x}/{y}/2/1_1.png";
  }
  function rainCloudUrl(frame, host) {
    return (host || "https://tilecache.rainviewer.com") + frame.path + "/256/{z}/{x}/{y}/0/1_0.png";
  }
  function clearWeatherLayers(rec) {
    ["weatherRain2d", "weatherClouds2d", "weatherNasa2d", "weatherRail2d", "weatherSeamark2d"].forEach(function (k) {
      if (rec[k] && rec.map2d) { try { rec.map2d.removeLayer(rec[k]); } catch (e) {} rec[k] = null; }
    });
    ["__rain3d", "__clouds3d", "__nasa3d", "__rail3d", "__seamark3d"].forEach(function (k) {
      if (rec[k] && rec.viewer) {
        try { rec.viewer.imageryLayers.remove(rec[k], true); } catch (e) {}
        rec[k] = null;
      }
    });
    if (rec.__rainAnim) { window.clearInterval(rec.__rainAnim); rec.__rainAnim = null; }
    if (rec.__cloudAnim) { window.clearInterval(rec.__cloudAnim); rec.__cloudAnim = null; }
  }
  function applyPositionRings(rec) {
    if (!rec) return;
    var C = window.Cesium;
    if (rec.viewer && C) {
      if (rec.__posRings) {
        try { rec.viewer.entities.remove(rec.__posRings); } catch (e) {}
        rec.__posRings = null;
      }
      if (rec.prefs.posRings) {
        try {
          var base = C.Cartesian3.fromDegrees(MY_POSITION[1], MY_POSITION[0], 0);
          rec.__posRings = rec.viewer.entities.add({
            position: base,
            point: {
              pixelSize: 9, color: C.Color.fromCssColorString("#ffd24a"),
              outlineColor: C.Color.BLACK, outlineWidth: 2, show: true
            },
            label: {
              text: "Standort", font: "11px Segoe UI, Arial, sans-serif",
              pixelOffset: new C.Cartesian2(12, 0),
              fillColor: C.Color.fromCssColorString("#ffd24a"),
              outlineColor: C.Color.BLACK, outlineWidth: 3,
              style: C.LabelStyle.FILL_AND_OUTLINE, show: true
            }
          });
          [50, 100, 200].forEach(function (km) {
            rec.viewer.entities.add({
              parent: rec.__posRings,
              position: base,
              ellipse: {
                semiMajorAxis: km * 1000, semiMinorAxis: km * 1000,
                heightReference: C.HeightReference ? C.HeightReference.CLAMP_TO_GROUND : undefined,
                material: C.Color.fromCssColorString("#ffd24a").withAlpha(0.05),
                outline: true, outlineColor: C.Color.fromCssColorString("#ffd24a").withAlpha(0.45)
              }
            });
          });
          try { rec.viewer.scene.requestRender(); } catch (e) {}
        } catch (e) {}
      }
    }
    if (rec.map2d && window.L) {
      if (rec.__posRings2d) {
        try { rec.map2d.removeLayer(rec.__posRings2d); } catch (e) {}
        rec.__posRings2d = null;
      }
      if (rec.prefs.posRings) {
        var group = window.L.layerGroup().addTo(rec.map2d);
        window.L.circleMarker([MY_POSITION[0], MY_POSITION[1]], {
          radius: 6, color: "#ffd24a", fillColor: "#ffd24a", fillOpacity: 0.9
        }).addTo(group).bindTooltip("Standort");
        [50, 100, 200].forEach(function (km) {
          window.L.circle([MY_POSITION[0], MY_POSITION[1]], {
            radius: km * 1000, color: "#ffd24a", weight: 1, fill: false, opacity: 0.45
          }).addTo(group);
        });
        rec.__posRings2d = group;
      }
    }
  }
  function applyWeatherLayers(rec) {
    if (!rec) return;
    clearWeatherLayers(rec);
    var frames = window.__dnxRainFrames || null;
    if ((rec.prefs.rain || rec.prefs.clouds) && !frames) { rainviewerRefresh(rec); return; }
    /* 2D */
    if (rec.map2d && window.L) {
      if (rec.prefs.rain && frames && frames.radar.length) {
        var frameIdx = frames.radar.length - 1;
        rec.weatherRain2d = window.L.tileLayer(rainRadarUrl(frames.radar[frameIdx], frames.host), {
          opacity: 0.65, maxZoom: 18, zIndex: 250, attribution: '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'
        }).addTo(rec.map2d);
        if (frames.radar.length > 1) {
          var idx = Math.max(0, frames.radar.length - 6);
          rec.__rainAnim = window.setInterval(function () {
            if (!rec.weatherRain2d) return;
            idx = idx + 1;
            if (idx >= frames.radar.length) idx = Math.max(0, frames.radar.length - 6);
            try { rec.weatherRain2d.setUrl(rainRadarUrl(frames.radar[idx], frames.host)); } catch (e) {}
          }, 700);
        }
      }
      if (rec.prefs.clouds && frames && frames.satellite.length) {
        rec.weatherClouds2d = window.L.tileLayer(rainCloudUrl(frames.satellite[frames.satellite.length - 1], frames.host), {
          opacity: 0.7, maxZoom: 18, zIndex: 240, attribution: '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer Satellit</a>'
        }).addTo(rec.map2d);
      }
      if (rec.prefs.nasa) {
        rec.weatherNasa2d = window.L.tileLayer(gibsUrl(GIBS_LAYERS.nasa), {
          opacity: clamp((Number(rec.prefs.nasaOpacity) || 50) / 100, 0, 1),
          maxZoom: 8, zIndex: 230,
          attribution: '<a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener">NASA GIBS</a>'
        }).addTo(rec.map2d);
      }
      if (rec.prefs.railways) {
        rec.weatherRail2d = window.L.tileLayer("https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
          opacity: 0.8, maxZoom: 18, zIndex: 220,
          attribution: '<a href="https://www.openrailwaymap.org/" target="_blank" rel="noopener">OpenRailwayMap</a>'
        }).addTo(rec.map2d);
      }
      if (rec.prefs.seamarks) {
        rec.weatherSeamark2d = window.L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          opacity: 0.9, maxZoom: 18, zIndex: 225,
          attribution: '<a href="https://www.openseamap.org/" target="_blank" rel="noopener">Seamarks © OpenSeaMap contributors</a>'
        }).addTo(rec.map2d);
      }
      if (rec.prefs.clouds && frames && frames.satellite.length > 1 && !rec.__cloudAnim) {
        var cidx = frames.satellite.length - 4;
        if (cidx < 0) cidx = 0;
        rec.__cloudAnim = window.setInterval(function () {
          if (!rec.weatherClouds2d) return;
          cidx = cidx + 1;
          if (cidx >= frames.satellite.length) cidx = 0;
          try { rec.weatherClouds2d.setUrl(rainCloudUrl(frames.satellite[cidx], frames.host)); } catch (e) {}
        }, 900);
      }
    }
    /* 3D */
    if (rec.viewer && window.Cesium) {
      var C = window.Cesium, layers = rec.viewer.imageryLayers;
      function add3d(url, credit, key) {
        try {
          rec[key] = layers.addImageryProvider(new C.UrlTemplateImageryProvider({ url: url, credit: credit, maximumLevel: 18 }));
        } catch (e) {}
      }
      if (rec.prefs.rain && frames && frames.radar.length) {
        add3d(rainRadarUrl(frames.radar[frames.radar.length - 1], frames.host),
          '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>', "__rain3d");
        if (rec.__rain3d) rec.__rain3d.alpha = 0.65;
      }
      if (rec.prefs.clouds && frames && frames.satellite.length) {
        add3d(rainCloudUrl(frames.satellite[frames.satellite.length - 1], frames.host),
          '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer Satellit</a>', "__clouds3d");
        if (rec.__clouds3d) rec.__clouds3d.alpha = 0.7;
      }
      if (rec.prefs.railways) {
        add3d("https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
          '<a href="https://www.openrailwaymap.org/" target="_blank" rel="noopener">OpenRailwayMap</a>', "__rail3d");
        if (rec.__rail3d) rec.__rail3d.alpha = 0.8;
      }
      if (rec.prefs.seamarks) {
        add3d("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
          '<a href="https://www.openseamap.org/" target="_blank" rel="noopener">Seamarks © OpenSeaMap contributors</a>', "__seamark3d");
        if (rec.__seamark3d) rec.__seamark3d.alpha = 0.9;
      }
      if (rec.prefs.nasa) {
        add3d(gibsUrl(GIBS_LAYERS.nasa), '<a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener">NASA GIBS</a>', "__nasa3d");
        if (rec.__nasa3d) rec.__nasa3d.alpha = clamp((Number(rec.prefs.nasaOpacity) || 50) / 100, 0, 1);
        if (rec.__nasa3d) rec.__nasa3d.maximumLevel = 8;
      }
      try { rec.viewer.scene.requestRender(); } catch (e) {}
    }
    /* keep radar fresh */
    if ((rec.prefs.rain || rec.prefs.clouds) && !rec.__rainRefresh) {
      rec.__rainRefresh = window.setInterval(function () { rainviewerRefresh(rec); }, 300000);
    }
    if (!rec.prefs.rain && !rec.prefs.clouds && rec.__rainRefresh) {
      window.clearInterval(rec.__rainRefresh); rec.__rainRefresh = null;
    }
  }

  /* ---- v4.14 motion: the visible GLB primitives and 2D markers are driven at
     ~10 Hz from the extrapolated samples (SDRangel semantics), not only at
     batch times. AIS stays on its constant-position behaviour. ---- */
  function updateLegacyMotion2d(record) {
    if (!record) return;
    var t = now();
    var m = record.__motion2d;
    var moved = !m ||
      Math.abs(m.x1 - record.lon) > 0.00003 ||
      Math.abs(m.y1 - record.lat) > 0.00003;
    if (moved) {
      var previousDisplay = m ? extrapolateLegacy2d(record) : null;
      record.__motion2d = {
        t0: m ? m.t1 : t, y0: m ? m.y1 : record.lat, x0: m ? m.x1 : record.lon,
        t1: t - Math.min(3600, record.__positionAgeSec || 0) * 1000, y1: record.lat, x1: record.lon,
        /* Reconcile a fresh fix without teleporting back from prediction.
           Corrections fade over one second; received coordinates stay intact. */
        correctionLat: previousDisplay ? previousDisplay.lat - record.lat : 0,
        correctionLon: previousDisplay ? previousDisplay.lon - record.lon : 0
      };
    }
    // A received ground speed and course already define display velocity.
    // Do not require a second CPR fix just to start rendering movement.
    if (record.__motion2d) {
      record.__motion2d.speedKn = asNumber(record.speedKn);
      record.__motion2d.courseDeg = asNumber(record.courseDeg);
      var motion=record.__motion2d;
      if (motion.courseDeg === null && (motion.x1 !== motion.x0 || motion.y1 !== motion.y0)) {
        var a=motion.y0*Math.PI/180,b=motion.y1*Math.PI/180,d=(motion.x1-motion.x0)*Math.PI/180;
        motion.courseDeg=(Math.atan2(Math.sin(d)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(d))*180/Math.PI+360)%360;
      }
    }
  }
  function extrapolateLegacy2d(record) {
    var m = record.__motion2d;
    if (m && m.speedKn !== null && m.speedKn >= 0 && m.speedKn < 2000 &&
        m.courseDeg !== null && isFinite(m.courseDeg)) {
      var age = Math.max(0, (now() - m.t1) / 1000);
      var ahead = Math.min(age, 60);
      var angle = m.speedKn * 0.514444 * ahead / 6371000;
      var bearing = m.courseDeg * Math.PI / 180;
      var lat0 = m.y1 * Math.PI / 180, lon0 = m.x1 * Math.PI / 180;
      var lat = Math.asin(clamp(Math.sin(lat0) * Math.cos(angle) + Math.cos(lat0) * Math.sin(angle) * Math.cos(bearing), -1, 1));
      var lon = lon0 + Math.atan2(Math.sin(bearing) * Math.sin(angle) * Math.cos(lat0), Math.cos(angle) - Math.sin(lat0) * Math.sin(lat));
      var correction = Math.max(0, 1 - age);
      return { lat: lat * 180 / Math.PI + (m.correctionLat || 0) * correction,
        lon: ((lon * 180 / Math.PI + 540) % 360) - 180 + (m.correctionLon || 0) * correction };
    }
    if (!m || !(m.t1 > m.t0) || !isFinite(m.x1) || !isFinite(m.y1)) return { lat: record.lat, lon: record.lon };
    var dt = (m.t1 - m.t0) / 1000;
    if (!(dt > 0)) return { lat: record.lat, lon: record.lon };
    var age = Math.max(0, (now() - m.t1) / 1000);
    var ahead = Math.min(age, 60);
    var correction = Math.max(0, 1 - age);
    var vx = (m.x1 - m.x0) / dt, vy = (m.y1 - m.y0) / dt;
    return {
      lat: m.y1 + vy * ahead + (m.correctionLat || 0) * correction,
      lon: m.x1 + vx * ahead + (m.correctionLon || 0) * correction
    };
  }
  /* v4.45 aircraft display: bounded prediction, reception-time reconciliation.
     The exponential correction cannot outrun forward velocity: tau >= 2*d/v.
     Both prediction and correction freeze at the same five-second horizon. */
  function aircraftProjectedFix(m, seconds) {
    var angle = (m.speedKn || 0) * 0.514444 * seconds / 6371000;
    var bearing = (m.courseDeg || 0) * Math.PI / 180;
    var lat0 = m.y1 * Math.PI / 180, lon0 = m.x1 * Math.PI / 180;
    var lat = Math.asin(clamp(Math.sin(lat0) * Math.cos(angle) + Math.cos(lat0) * Math.sin(angle) * Math.cos(bearing), -1, 1));
    var lon = lon0 + Math.atan2(Math.sin(bearing) * Math.sin(angle) * Math.cos(lat0), Math.cos(angle) - Math.sin(lat0) * Math.sin(lat));
    return {lat: lat * 180 / Math.PI, lon: ((lon * 180 / Math.PI + 540) % 360) - 180};
  }
  function updateMotion2d(record) {
    if (!record || record.kind !== "adsb") return updateLegacyMotion2d(record);
    var t = now(), m = record.__motion2d;
    var sameFix = m && record.lat === m.y1 && record.lon === m.x1;
    var stamp = Number(record.lastPositionAt) || (sameFix ? m.t1 : t - Math.max(0, Number(record.__positionAgeSec) || 0) * 1000);
    var speed = asNumber(record.speedKn), course = asNumber(record.courseDeg);
    if (speed === null && m && !sameFix && stamp > m.t1) {
      var sampleDy = (record.lat-m.y1)*111195;
      var sampleDx = (record.lon-m.x1)*111195*Math.cos(record.lat*Math.PI/180);
      speed = Math.sqrt(sampleDx*sampleDx + sampleDy*sampleDy) / ((stamp-m.t1)/1000) / 0.514444;
    }
    if (speed === null || speed < 0 || speed >= 2000) speed = 0;
    if (course === null || !isFinite(course)) {
      if (m && !sameFix) {
        var dy = (record.lat-m.y1)*Math.PI/180, dx = (record.lon-m.x1)*Math.PI/180*Math.cos(record.lat*Math.PI/180);
        course = (Math.atan2(dx,dy)*180/Math.PI+360)%360;
      } else course = m ? m.courseDeg : null;
    }
    if (course === null) { speed = 0; course = 0; }
    if (m && m.aircraft445 && stamp <= m.t1 && record.lat === m.y1 && record.lon === m.x1 && speed === m.speedKn && course === m.courseDeg) return;
    if (m && m.aircraft445 && stamp < m.t1) return;
    var previous = m ? extrapolate2d(record) : null;
    var age = Math.max(0, (t - stamp) / 1000);
    var next = {aircraft445:true, t0:m ? m.t1 : stamp, x0:m ? m.x1 : record.lon, y0:m ? m.y1 : record.lat, t1:stamp, receivedAt:t, y1:record.lat, x1:record.lon,
      speedKn:speed, courseDeg:course, startAge:Math.min(age,5), correctionLat:0, correctionLon:0, tau:2};
    var base = aircraftProjectedFix(next, next.startAge);
    if (previous) {
      next.correctionLat = previous.lat - base.lat;
      next.correctionLon = ((previous.lon - base.lon + 540) % 360) - 180;
      var dy = next.correctionLat * 111195;
      var dx = next.correctionLon * 111195 * Math.cos(base.lat * Math.PI / 180);
      next.tau = Math.max(2, 2 * Math.sqrt(dx*dx + dy*dy) / Math.max(1, speed * 0.514444));
    }
    record.__motion2d = next;
  }
  function extrapolate2d(record) {
    var m = record && record.__motion2d;
    if (!m || !m.aircraft445) return extrapolateLegacy2d(record);
    var elapsed = Math.min(Math.max(0, (now() - m.receivedAt) / 1000), Math.max(0, 5 - m.startAge));
    var base = aircraftProjectedFix(m, m.startAge + elapsed);
    // With no valid ground speed, hold rather than manufacture a return glide.
    var decay = m.speedKn > 0 ? Math.exp(-elapsed / m.tau) : 1;
    return {lat:base.lat + m.correctionLat * decay,
      lon:((base.lon + m.correctionLon * decay + 540) % 360) - 180};
  }
  function installMotionTicker(rec) {
    if (!rec || rec.__motionTicker) return;
    rec.__motionTicker = true;
    var run = function () {
      rec.__motionTicks = (rec.__motionTicks || 0) + 1;
      rec.__motionLastTick = now();
      /* Resolve on every tick: 2D may install this timer before Cesium loads. */
      var C = window.Cesium;
      try {
        if (!rec.win || !rec.win.isConnected) return;
        var kindKey = rec.spec && rec.spec.key;
        if (rec.infoPanel && now() - (rec.__infoUpdatedAt || 0) >= 1000) {
          rec.__infoUpdatedAt = now();
          try { renderInfoPage(rec); } catch(infoError) { rec.__infoUpdateError=String(infoError); }
        }
        /* 3D: glide every visible primitive (aircraft AND ships) along the extrapolated track */
        if (rec.viewer && C) {
          var groups = [
            { map: rec.aircraftModels, records: RECORDS.adsb || {}, prefix: "adsb-", kind: "adsb" },
            { map: rec.shipModels, records: RECORDS.ais || {}, prefix: "ais-", kind: "ais" }
          ];
          for (var g = 0; g < groups.length; g++) {
            var grp = groups[g], models = grp.map || {}, ids = Object.keys(models);
            for (var i = 0; i < ids.length; i++) {
              var entry = models[ids[i]];
              if (!entry || entry.cancelled || !entry.model) continue;
              var record = grp.records[String(ids[i]).replace(new RegExp("^" + grp.prefix), "")];
              if (!record) continue;
              try {
              var pos = livePositionFor(rec, grp.kind, record, C);
              if (grp.kind === "adsb") entry.modelMatrix = aircraftModelMatrix(rec, record, C, pos);
              else {
                var shipOffset = 0;
                if (rec.follow && (rec.follow.kind || kindKey) === "ais" && rec.follow.id === String(record.id)) {
                  shipOffset = rec.follow.modelOffsetDeg || 0;
                }
                entry.modelMatrix = aisModelMatrix(record, C, shipOffset, pos);
              }
              entry.model.modelMatrix = entry.modelMatrix;
              /* v4.16 target lock: glowing silhouette on the pursued model */
              try {
                var locked = !!(rec.follow && rec.follow.id === String(record.id) &&
                  (rec.follow.kind || kindKey) === grp.kind);
                if (grp.kind === "adsb") applyAircraftContrast(rec, entry.model, record, C);
                else {
                  entry.model.silhouetteSize = locked ? 3 : 0;
                  if (locked) entry.model.silhouetteColor = C.Color.fromCssColorString("#ffd24a");
                }
              } catch (e1) {}
              } catch (modelError) { entry.__motionError = String(modelError); }
            }
          }
          try { refreshAircraftContrast(rec); } catch (contrastError) { rec.__contrastError = String(contrastError); }
          Object.keys(rec.entities || {}).forEach(function(id){
            var entity=rec.entities[id],record=(RECORDS[kindKey] || {})[id.replace(kindKey+"-","")];
            if (!entity || !entity.polyline || !record) return;
            try {
              entity.polyline.positions=trackPositions(kindKey,record,C);
              entity.polyline.show=trackShow(rec,record)&&trackDisplayPoints(record).length>=2;
            } catch(trackError) {}
          });
          /* v4.16 pursuit: the camera rides the extrapolated target every tick */
          if (rec.follow) {
            var fRec = followRecord(rec);
            if (fRec && validPosition(asNumber(fRec.lat), asNumber(fRec.lon))) updateFollowCamera(rec, fRec);
            rec.__followHudAt = rec.__followHudAt || 0;
            if (now() - rec.__followHudAt > 500) {
              rec.__followHudAt = now();
              updateFollowUi(rec);
            }
          }
          try { rec.viewer.scene.requestRender(); } catch (e0) {}
        }
        /* 2D: markers glide (AIS and ADS-B); pursued map view pans along */
        if (rec.map2d && rec.map2dMarkers) {
          var mrecords = (kindKey && RECORDS[kindKey]) || {};
          var mids = Object.keys(rec.map2dMarkers);
          for (var j = 0; j < mids.length; j++) {
            var r = mrecords[mids[j]];
            var marker = rec.map2dMarkers[mids[j]];
            if (!r || !marker) continue;
            var ll = extrapolate2d(r);
            var points = trackDisplayPoints(r);
            var trace = rec.map2dTracks && rec.map2dTracks[mids[j]];
            if (trackShow(rec,r) && points.length>=2) {
              var latlngs=points.map(function(p){return [p.lat,p.lon];});
              if (trace) trace.setLatLngs(latlngs);
              else if (window.L && rec.map2dTracks) rec.map2dTracks[mids[j]]=createTrack2D(window.L,latlngs,rec);
            } else if (trace) { rec.map2d.removeLayer(trace);delete rec.map2dTracks[mids[j]]; }
            var cur = marker.getLatLng();
            if (!cur || Math.abs(cur.lat - ll.lat) > 1e-7 || Math.abs(cur.lng - ll.lon) > 1e-7) {
              marker.setLatLng([ll.lat, ll.lon]);
            }
          }
          if (rec.follow) {
            rec.__followPanAt = rec.__followPanAt || 0;
            if (now() - rec.__followPanAt > 600) {
              rec.__followPanAt = now();
              var panRec = followRecord(rec);
              if (panRec && validPosition(asNumber(panRec.lat), asNumber(panRec.lon))) {
                var pll = extrapolate2d(panRec);
                try { rec.map2d.panTo([pll.lat, pll.lon], { animate: true }); } catch (e2) {}
              }
            }
          }
        }
      } catch (e) {
        rec.__motionError = String(e && (e.stack || e.message) || e);
        rec.__motionErrorAt = now();
        rec.__motionErrors = (rec.__motionErrors || 0) + 1;
      }
    };
    window.setInterval(run, 100);
  }

  function aircraftDisplayProperty(record, C) {
    if (!C.CallbackProperty || !C.ReferenceFrame || !C.PositionProperty) return null;
    var callback = function (time, result) {
      var ll = extrapolate2d(record);
      return C.Cartesian3.fromDegrees(ll.lon, ll.lat, Math.max(8, Number(record.altitudeM) || 0), undefined, result);
    };
    var prop = new C.CallbackProperty(callback, false);
    prop.referenceFrame = C.ReferenceFrame.FIXED;
    prop.getValueInReferenceFrame = function (time, referenceFrame, result) {
      return C.PositionProperty.convertToReferenceFrame(time, callback(time, result), C.ReferenceFrame.FIXED, referenceFrame, result);
    };
    return prop;
  }

  function makeEntity(rec, record) {
    var C = window.Cesium, kind = rec.spec.key;
    var id = kind + "-" + record.id;
    var pos = positionFor(kind, record, C);
    var entityPos = pos;
    {
      var sampled = addPositionSample(record, pos, C);
      if (sampled) entityPos = sampled;
    }
    var sharedPosition = kind === "adsb" ? aircraftDisplayProperty(record, C) : null;
    if (sharedPosition) entityPos = sharedPosition;
    var color = colorFor(kind, record, C);
    var label = recordLabel(kind, record);
    var opts = {
      id: id,
      position: entityPos,
      orientation: makeOrientation(kind, record, pos, C),
      point: {
        pixelSize: kind === "adsb" ? 6 : 7,
        color: color,
        outlineColor: C.Color.WHITE,
        outlineWidth: 1,
        show: true
      },
      label: {
        text: label,
        font: "11px Segoe UI, Arial, sans-serif",
        scale: Number(rec.prefs.labelScale) || 1,
        pixelOffset: new C.Cartesian2(0, -(25 * aircraftSizeFactor(rec) + 14)),
        horizontalOrigin: C.HorizontalOrigin && C.HorizontalOrigin.CENTER,
        verticalOrigin: C.VerticalOrigin && C.VerticalOrigin.BOTTOM,
        backgroundPadding: new C.Cartesian2(4, 2),
        fillColor: C.Color.fromCssColorString(trackContrast2D(rec.prefs.baseMap).color),
        outlineColor: C.Color.fromCssColorString(trackContrast2D(rec.prefs.baseMap).outline),
        outlineWidth: 2,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        showBackground: false,
        backgroundColor: C.Color.fromCssColorString(trackContrast2D(rec.prefs.baseMap).outline).withAlpha(0.85),
        show: rec.prefs.labels
      },
      polyline: {
        positions: trackPositions(kind, record, C),
        width: kind === "adsb" ? 7 : 5,
        material: cesiumTrackMaterial(kind, C, rec),
        clampToGround: true,
        show: trackShow(rec, record) && trackDisplayPoints(record).length >= 2
      }
    };
    if (kind === "adsb") {
      opts.model = {
        uri: AIRCRAFT_MODEL,
        scale: modelScale(kind, record),
        minimumPixelSize: 50 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record),
        maximumScale: 12000,
        runAnimations: false,
        color: C.Color.WHITE,
        silhouetteSize: 0
      };
    } else {
      var modelKind = record.kindName || aisModelKind(record);
      if (modelKind !== "station" && modelKind !== "aid") {
        /* The pickable anchor stays tiny while the detailed GLB is fetched as a Cesium primitive. */
        opts.point.pixelSize = 3;
        opts.point.outlineWidth = 0;
      } else {
        opts.point.pixelSize = modelKind === "aid" ? 10 : 8;
      }
    }
    var entity = rec.viewer.entities.add(opts);
    entity.__dnxSharedMotion = !!sharedPosition;
    rec.entities[id] = entity;
    rec.entityKinds[id] = kind === "ais" ? (record.kindName || aisModelKind(record)) : "aircraft";
    if (kind === "ais") ensureShipModel(rec, entity, record);
    else ensureAircraftModel(rec, entity, record);
    return entity;
  }

  function updateEntity(rec, entity, record) {
    var C = window.Cesium, kind = rec.spec.key;
    var pos = positionFor(kind, record, C);
    if (entity.__dnxSharedMotion) {
      addPositionSample(record, pos, C); // raw samples remain measured-only
    } else if (entity.position && typeof entity.position.addSample === "function") {
      addPositionSample(record, pos, C);
    } else {
      entity.position = pos;
    }
    entity.orientation = displayOrientation(rec, kind, record, pos, C, !!entity.model);
    if (entity.label) {
      entity.label.text = recordLabel(kind, record);
      entity.label.show = !!rec.prefs.labels;
    }
    if (entity.polyline) {
      entity.polyline.positions = trackPositions(kind, record, C);
      entity.polyline.show = trackShow(rec, record) && trackDisplayPoints(record).length >= 2;
      entity.polyline.width = kind === "adsb" ? 7 : 5;
      entity.polyline.clampToGround = true;
      entity.polyline.material = cesiumTrackMaterial(kind, C, rec);
    }
    if (kind === "adsb") {
      if (entity.model) {
        entity.model.scale = 1.25 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record);
        entity.model.minimumPixelSize = 50 * aircraftSizeFactor(rec) * aircraftTargetZoom(rec, record);
      }
      ensureAircraftModel(rec, entity, record);
    } else {
      if (entity.model) entity.model.scale = modelScale(kind, record);
      ensureShipModel(rec, entity, record);
    }
  }

  function mapColorCss(kind, record) {
    if (kind === "adsb") {
      if (record.emergency && record.emergency !== "NONE") return "#ff4555";
      if ((record.altitudeM || 0) < 1200) return "#ffc928";
      return "#49c8ff";
    }
    var colors = {
      cargo: "#3478f6", tanker: "#ff8b3d", passenger: "#b273ff",
      tug: "#ffd43b", fishing: "#21c77a", sail: "#f1f5f9",
      dredger: "#ff922b", hsc: "#21c9d4", pilot: "#ff7b35",
      sar: "#ff4545", patrol: "#c2d0dc", yacht: "#f4f6f8", generic: "#38c979"
    };
    return colors[record.kindName || aisModelKind(record)] || colors.generic;
  }

  function leafletIcon(kind, record, rec) {
    var contrast = trackContrast2D(rec && rec.prefs && rec.prefs.baseMap);
    var color = kind === "adsb" ? contrast.color : mapColorCss(kind, record);
    var outline = kind === "adsb" ? contrast.outline : "#071018";
    var heading = headingFor(kind, record);
    var path = kind === "ais"
      ? '<path d="M16 2 L27 25 L16 21 L5 25 Z" fill="' + color + '" stroke="#071018" stroke-width="2"/>'
      : '<path d="M16 1 L19 12 L29 16 L29 19 L19 17 L18 27 L23 29 L23 31 L16 29 L9 31 L9 29 L14 27 L13 17 L3 19 L3 16 L13 12 Z" fill="' + color + '" stroke="' + outline + '" stroke-width="1.7"/>';
    var pixels = Math.round(28 * (kind === "adsb" ? aircraftSizeFactor(rec) : 1));
    var box = pixels + 2;
    var selected = kind === "adsb" && rec && rec.selection && rec.selection.id === String(record.id);
    var frameCss = selected ? "outline:2px solid " + contrast.color + ";outline-offset:4px;border-radius:3px;box-shadow:0 0 0 5px " + contrast.outline + ";" : "";
    var html = '<div class="dnx-am-leaf-marker" style="width:100%;height:100%;' + frameCss + '"><svg viewBox="0 0 32 32" width="' + pixels + '" height="' + pixels + '" style="transform:rotate(' + heading + 'deg)">' + path + '</svg></div>';
    return window.L.divIcon({ html: html, className: "dnx-am-leaflet-icon", iconSize: [box, box], iconAnchor: [box / 2, box / 2], tooltipAnchor: [0, -box / 2] });
  }

  function trackColorCss(kind) { return kind === "ais" ? "#ffe85a" : "#43e9ff"; }

  function trackContrast2D(baseMap) {
    var dark = baseMap === "dark" || baseMap === "satellite" || baseMap === "satlabels";
    return dark ? { color: "#ffffff", outline: "#101820" } :
      { color: "#17212b", outline: "#ffffff" };
  }
  function styleTrack2D(track, rec) {
    if (!track || !track.__contrastLines) return;
    var colors = trackColors(rec);
    track.__contrastLines[0].setStyle({ color: colors.outline });
    track.__contrastLines[1].setStyle({ color: colors.color });
  }
  function createTrack2D(L, latlngs, rec) {
    var colors = trackColors(rec);
    function line(color, width) {
      return L.polyline(latlngs, { color: color, weight: width, opacity: 1,
        lineCap: "round", lineJoin: "round", interactive: false,
        className: "dnx-am-track" });
    }
    /* Two real Canvas-compatible strokes, not a CSS-only SVG effect. */
    var lines = [line(colors.outline, 7), line(colors.color, 3)];
    var group = L.layerGroup(lines);
    group.__contrastLines = lines;
    group.setLatLngs = function (points) {
      lines[0].setLatLngs(points); lines[1].setLatLngs(points); return group;
    };
    return group.addTo(rec.map2d);
  }


  function trafficLabelNode(rec, text) {
    var node = textNode(text), colors = trackContrast2D(rec.prefs.baseMap);
    node.style.cssText = "display:inline-block;padding:2px 4px;border-radius:3px;font:600 11px Segoe UI,Arial,sans-serif;color:" + colors.color + ";background:transparent;border:0;text-shadow:-1px -1px 0 " + colors.outline + ",1px -1px 0 " + colors.outline + ",-1px 1px 0 " + colors.outline + ",1px 1px 0 " + colors.outline + ";line-height:15px;white-space:nowrap;pointer-events:none;";
    return node;
  }

  // Re-evaluate screen clearance after zoom, rather than shrinking the offset
  // with distance. Text bottom is outside the aircraft's projected extent.
  function updateTrafficLabels(rec) {
    var C = window.Cesium, viewer = rec && rec.viewer;
    if (!C || !viewer || !rec.entities) return;
    var scene = viewer.scene, camera = viewer.camera;
    var colors = trackContrast2D(rec.prefs.baseMap);
    Object.keys(rec.entities).forEach(function (id) {
      var entity = rec.entities[id];
      if (!entity || !entity.label) return;
      try {
        var label = entity.label;
        var key = colors.color + colors.outline;
        if (entity.__labelContrast !== key) {
          label.fillColor = C.Color.fromCssColorString(colors.color);
          label.outlineColor = C.Color.fromCssColorString(colors.outline);
          label.backgroundColor = C.Color.fromCssColorString(colors.outline).withAlpha(0.85);
          label.outlineWidth = 2;
          label.showBackground = false;
          label.horizontalOrigin = C.HorizontalOrigin.CENTER;
          label.verticalOrigin = C.VerticalOrigin.BOTTOM;
          entity.__labelContrast = key;
        }
        var halfSize = id.indexOf("adsb-") === 0 ? 25 * aircraftSizeFactor(rec) : 20;
        var entry = (rec.aircraftModels || {})[id] || (rec.shipModels || {})[id];
        var sphere = entry && entry.model && entry.model.boundingSphere;
        var entityPosition = entity.position && entity.position.getValue && entity.position.getValue(viewer.clock.currentTime);
        if (!sphere && entityPosition && id.indexOf("adsb-") === 0) {
          var record = RECORDS.adsb[id.slice(5)];
          if (record) sphere = { center: entityPosition, radius: aircraftModelLength(record) * aircraftSizeFactor(rec) / 2 };
        }
        var offsetX = 0, offsetY = 0;
        if (sphere && entityPosition && scene.cartesianToCanvasCoordinates) {
          var modelXY = scene.cartesianToCanvasCoordinates(sphere.center, new C.Cartesian2());
          var entityXY = scene.cartesianToCanvasCoordinates(entityPosition, new C.Cartesian2());
          if (modelXY && entityXY) {
            offsetX = Math.round(modelXY.x - entityXY.x);
            offsetY = Math.round(modelXY.y - entityXY.y);
          }
        }
        if (sphere && camera && scene.canvas) {
          var delta = C.Cartesian3.subtract(sphere.center, camera.positionWC, new C.Cartesian3());
          var distance = Math.max(1, C.Cartesian3.magnitude(delta));
          halfSize = Math.max(halfSize, sphere.radius * scene.canvas.clientHeight /
            (2 * distance * Math.tan((camera.frustum.fovy || Math.PI / 3) / 2)));
        }
        var gap = Math.ceil(halfSize + 14);
        var offsetKey = offsetX + ":" + (offsetY - gap);
        if (entity.__labelOffset !== offsetKey) {
          label.pixelOffset = new C.Cartesian2(offsetX, offsetY - gap);
          entity.__labelOffset = offsetKey;
        }
      } catch (e) { /* An asynchronously loading model is retried next frame. */ }
    });
  }

  function textNode(text) {
    var node = document.createElement("span");
    node.textContent = safeText(text);
    return node;
  }

  function syncMap2D(rec) {
    if (!rec || !rec.map2d || !window.L) return;
    var L = window.L, kind = rec.spec.key;
    var records = getRecords(kind), seen = Object.create(null);
    records.forEach(function (record) {
      var id = String(record.id), marker = rec.map2dMarkers[id];
      var label = recordLabel(kind, record);
      var display = extrapolate2d(record);
      if (!marker) {
        marker = L.marker([display.lat, display.lon], {
          icon: leafletIcon(kind, record, rec),
          keyboard: true,
          title: label,
          riseOnHover: true,
          zIndexOffset: 500
        }).addTo(rec.map2d);
        marker.on("click", function () { selectTrafficTarget(rec, kind, id); });
        marker.bindTooltip(trafficLabelNode(rec, label), { direction: "top", sticky: false, offset: [0, -(12 + Math.ceil(28 * aircraftSizeFactor(rec) * 0.208))], className: "dnx-am-traffic-label", permanent: !!rec.prefs.labels, opacity: 1 });
        marker.on("contextmenu", function (event) {
          var original = event && event.originalEvent;
          if (original) { original.preventDefault(); original.stopPropagation(); }
          showContextMenu(rec, kind, id, original ? original.clientX : 20, original ? original.clientY : 20);
        });
        rec.map2dMarkers[id] = marker;
      } else {
        marker.setLatLng([display.lat, display.lon]);
        marker.setIcon(leafletIcon(kind, record, rec));
        marker.options.title = label;
        var tooltip = marker.getTooltip && marker.getTooltip();
        if (tooltip) {
          tooltip.setContent(trafficLabelNode(rec, label));
          tooltip.options.offset = [0, -(12 + Math.ceil(28 * aircraftSizeFactor(rec) * 0.208))];
          tooltip.options.permanent = !!rec.prefs.labels;
          if (rec.prefs.labels) marker.openTooltip();
          else marker.closeTooltip();
        }
      }
      seen[id] = true;

      var points = trackDisplayPoints(record);
      var track = rec.map2dTracks[id];
      if (trackShow(rec, record) && points.length >= 2) {
        var latlngs = points.map(function (point) { return [point.lat, point.lon]; });
        if (track) {
          track.setLatLngs(latlngs);
          styleTrack2D(track, rec);
        } else {
          rec.map2dTracks[id] = createTrack2D(L, latlngs, rec);
        }
      } else if (track) {
        try { rec.map2d.removeLayer(track); } catch (e) {}
        delete rec.map2dTracks[id];
      }
    });

    Object.keys(rec.map2dMarkers).forEach(function (id) {
      if (seen[id]) return;
      try { rec.map2d.removeLayer(rec.map2dMarkers[id]); } catch (e) {}
      delete rec.map2dMarkers[id];
      if (rec.map2dTracks[id]) {
        try { rec.map2d.removeLayer(rec.map2dTracks[id]); } catch (e2) {}
        delete rec.map2dTracks[id];
      }
    });

    if (!rec.didMapAutoFit && records.length) {
      var focus = records.slice().sort(function (a, b) { return (b.lastPositionAt || 0) - (a.lastPositionAt || 0); })[0];
      if (focus) rec.map2d.setView([focus.lat, focus.lon], kind === "ais" ? 12 : 9, { animate: true });
      rec.didMapAutoFit = true;
    }
    var mapWait = q(".dnx-am-map-wait", rec.win);
    if (mapWait) mapWait.style.display = records.length ? "none" : "block";
  }

  function fitMap2D(rec, force) {
    if (!rec || !rec.map2d) return;
    var records = getRecords(rec.spec.key);
    if (!records.length) {
      if (force) rec.map2d.setView([51.66, 6.97], 7, { animate: true });
      return;
    }
    if (!force) {
      var focus = records.slice().sort(function (a, b) { return (b.lastPositionAt || 0) - (a.lastPositionAt || 0); })[0];
      if (focus) rec.map2d.setView([focus.lat, focus.lon], rec.spec.key === "ais" ? 13 : 10, { animate: true });
      return;
    }
    if (records.length === 1) {
      rec.map2d.setView([records[0].lat, records[0].lon], rec.spec.key === "ais" ? 13 : 10, { animate: true });
      return;
    }
    var bounds = window.L.latLngBounds(records.map(function (r) { return [r.lat, r.lon]; }));
    rec.map2d.fitBounds(bounds, { padding: [36, 36], maxZoom: rec.spec.key === "ais" ? 13 : 10, animate: true });
  }

  function syncViewer(rec) {
    if (!rec || !rec.viewer || !window.Cesium) return;
    var records = getRecords(rec.spec.key);
    var seen = Object.create(null);
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      var id = rec.spec.key + "-" + record.id;
      var newKind = rec.spec.key === "ais" ? (record.kindName || aisModelKind(record)) : "aircraft";
      var entity = rec.entities[id];
      if (entity && rec.entityKinds[id] !== newKind) {
        removeShipModel(rec, id);
        removeAircraftModel(rec, id);
        try { rec.viewer.entities.remove(entity); } catch (e) {}
        delete rec.entities[id];
        delete rec.entityKinds[id];
        entity = null;
      }
      if (!entity) entity = makeEntity(rec, record);
      else updateEntity(rec, entity, record);
      seen[id] = true;
    }
    Object.keys(rec.entities).forEach(function (id) {
      if (seen[id]) return;
      removeShipModel(rec, id);
      removeAircraftModel(rec, id);
      try { rec.viewer.entities.remove(rec.entities[id]); } catch (e) {}
      delete rec.entities[id];
      delete rec.entityKinds[id];
    });
    updateWindowStatus(rec.spec.key);
    if (rec.follow) {
      var currentFollowRecord = followRecord(rec);
      if (!currentFollowRecord || !validPosition(asNumber(currentFollowRecord.lat), asNumber(currentFollowRecord.lon))) {
        stopFollow(rec, false);
      } else {
        updateFollowCamera(rec, currentFollowRecord);
        updateFollowUi(rec);
      }
    }
    if (!rec.didAutoFit && records.length && !rec.follow) {
      rec.didAutoFit = true;
      window.setTimeout(function () { if (!rec.follow) fitWindow(rec, false); }, 500);
    }
    resizeViewer(rec);
  }

  function scheduleSync(kind) {
    updateWindowStatus(kind);
    var rec = WINDOWS[kind];
    if (!rec || (!rec.viewer && !rec.map2d) || rec.syncPending) return;
    rec.syncPending = true;
    var run = function () {
      rec.syncPending = false;
      if (!rec.win || !rec.win.isConnected) return;
      if (rec.map2d) syncMap2D(rec);
      if (rec.viewer) syncViewer(rec);
    };
    if (window.requestAnimationFrame) window.requestAnimationFrame(run);
    else window.setTimeout(run, 50);
  }

  function followTargetKind(rec) {
    return rec && rec.follow && rec.follow.kind ? rec.follow.kind : (rec && rec.spec ? rec.spec.key : "ais");
  }

  function followRecord(rec) {
    var kind = followTargetKind(rec);
    return rec && rec.follow ? (RECORDS[kind] || {})[rec.follow.id] : null;
  }

  function followModelLength(kind, record) {
    if (kind === "adsb") return aircraftModelLength(record);
    return aisShipDimensions(record).length;
  }

  function aisFocusHeight(record) {
    var modelKind = record && (record.kindName || aisModelKind(record));
    var nominalLength = MODEL_BASE_LENGTH[modelKind] || 75;
    var length = asNumber(record && record.lengthM);
    if (length === null || length <= 0) length = nominalLength;
    /* Close enough to see the type-specific deck/superstructure, capped for long ships. */
    return clamp(length * 100, 16000, 42000);
  }

  function fitWindow(rec, force) {
    if (!rec) return;
    if (force && rec.follow) stopFollow(rec, false);
    fitMap2D(rec, force);
    if (!rec.viewer) return;
    if (!force && rec.follow) {
      var focused = followRecord(rec);
      if (focused) updateFollowCamera(rec, focused);
      return;
    }
    var list = Object.keys(rec.entities).map(function (id) { return rec.entities[id]; });
    if (!list.length) {
      if (force) defaultView(rec.viewer);
      return;
    }
    try {
      if (rec.spec.key === "ais" && !force) {
        var candidates = getRecords("ais");
        candidates.sort(function (a, b) { return (b.lastPositionAt || 0) - (a.lastPositionAt || 0); });
        var focus = candidates[0];
        if (focus) {
          rec.viewer.camera.flyTo({
            destination: window.Cesium.Cartesian3.fromDegrees(
              focus.lon, focus.lat, aisFocusHeight(focus)
            ),
            duration: 1.0
          });
          return;
        }
      }
      if (list.length === 1) {
        var id = list[0].id.replace(rec.spec.key + "-", "");
        var record = (RECORDS[rec.spec.key] || {})[id];
        if (!record) {
          rec.viewer.zoomTo(list);
          return;
        }
        var height = rec.spec.key === "adsb"
          ? Math.max(90000, (Number(record.altitudeM) || 0) + 60000)
          : aisFocusHeight(record);
        rec.viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(record.lon, record.lat, height),
          duration: 0.8
        });
      } else {
        /* The explicit “Alle Ziele” control remains available for a full fleet overview. */
        rec.viewer.flyTo(list, { duration: 0.8 });
      }
    } catch (e) {
      try { rec.viewer.zoomTo(list); } catch (e2) {}
    }
  }

  function updateFollowUi(rec) {
    if (!rec || !rec.win) return;
    var hud = q("[data-am-follow-hud]", rec.win);
    var follow = rec.follow;
    if (!hud) return;
    hud.hidden = !follow || !!follow.native;
    if (!follow) return;
    var kind = followTargetKind(rec);
    var record = (RECORDS[kind] || {})[follow.id];
    var kindLabel = kind === "adsb" ? "ADS-B" : "AIS";
    var title = q("[data-am-follow-title]", hud);
    var course = q("[data-am-follow-course]", hud);
    var preset = q("[data-am-follow-preset]", hud);
    var slider = q("[data-am-follow-offset]", hud);
    var offsetValue = q("[data-am-follow-offset-value]", hud);
    var autoButton = q('[data-am-action="toggle-auto-orbit"]', hud);
    if (title) title.textContent = record ? recordLabel(kind, record) : ((kind === "adsb" ? "ICAO " : "MMSI ") + follow.id);
    if (course) {
      var heading = record ? Math.round(headingFor(kind, record)) : 0;
      var offset = Math.round(follow.modelOffsetDeg || 0);
      course.textContent = kindLabel + " " + String(heading).padStart(3, "0") + "°" +
        (offset ? " · Anzeige " + (offset > 0 ? "+" : "") + offset + "°" : "");
      course.title = offset ? kindLabel + "-Kurs bleibt " + heading + "°; Modell-Offset ist nur visuell." : "Modell folgt dem " + kindLabel + "-Kurs/Heading.";
    }
    var telemetry = q("[data-am-follow-telemetry]", hud);
    if (telemetry && record) {
      var distKm = haversineKm(MY_POSITION[0], MY_POSITION[1], asNumber(record.lat) || 0, asNumber(record.lon) || 0);
      var speed = kind === "adsb" ? (asNumber(record.speedKn) || 0) : (asNumber(record.sogKn) || 0);
      var altPart = kind === "adsb" ? Math.round((record.altitudeFt || 0)) + " ft · " : "";
      telemetry.textContent = altPart + Math.round(speed) + " kn · " + distKm.toFixed(1) + " km zum Standort";
    }
    if (preset) preset.value = follow.preset || "custom";
    if (slider && !rec.__offsetDragging) slider.value = String(Math.round(follow.modelOffsetDeg || 0));
    if (offsetValue) {
      var deg = Math.round(follow.modelOffsetDeg || 0);
      offsetValue.textContent = (deg > 0 ? "+" : "") + deg + "°";
    }
    if (autoButton) {
      autoButton.textContent = follow.autoOrbit ? "360° AN" : "360° AUS";
      autoButton.setAttribute("aria-pressed", follow.autoOrbit ? "true" : "false");
    }
  }

  function startFollowTarget(rec, id) {
    if (!rec || !rec.win) return;
    id = String(id || "");
    var kind = rec.spec && rec.spec.key === "adsb" ? "adsb" : "ais";
    var record = (RECORDS[kind] || {})[id];
    if (!record || !validPosition(asNumber(record.lat), asNumber(record.lon))) {
      showToast(rec, "Für diese AIS-/ADS-B-Position ist keine Folgeansicht verfügbar.");
      return;
    }
    rec.pendingFollowId = id;
    if (rec.prefs.mode === "2d") {
      var viewerAlreadyReady = !!rec.viewer;
      setMapMode(rec, "3d", true);
      if (viewerAlreadyReady) return startFollowTarget(rec, id);
      return;
    }
    if (!rec.viewer) {
      createViewer(rec);
      showToast(rec, "3D-Folgeansicht wird vorbereitet …");
      return;
    }
    rec.pendingFollowId = null;
    if (rec.follow) stopFollow(rec, false);
    var nativeTarget = nativeTargetFor(rec, kind, id);
    if (nativeTarget) {
      var heading = headingFor(kind, record);
      rec.follow = { native: true, kind: kind, id: id, yaw: 0, pitch: 28, range: 3.1,
        camHeading: heading, lastCameraAt: now(), modelOffsetDeg: 0, autoOrbit: false,
        preset: "behind", lastFrameMs: 0, raf: null };
      if (kind === "adsb" && rec.prefs.aircraftDistance) {
        rec.follow.range = Math.max(0.1, (rec.prefs.aircraftDistance - 12) / aircraftModelLength(record));
      }
      var length = followModelLength(kind, record);
      var distance = rec.follow.range * length + (kind === "adsb" ? 12 : 15);
      var offset = followCameraLocal(heading, 0, 28, distance, 0);
      nativeTarget.viewFrom = new window.Cesium.Cartesian3(offset.east, offset.north, offset.up);
      rec.selection = { kind: kind, id: id };
      rec.viewer.trackedEntity = nativeTarget;
      rec.viewer.selectedEntity = nativeTarget;
      rec.didAutoFit = true;
      updateFollowUi(rec); updateNativeCameraButton(rec);
      rec.viewer.scene.requestRender();
      setStatus(rec, "Mausrad: Flugzeug ausgewählt = nur dieses Modell · ohne Auswahl = Karte");
      return;
    }
    var controller = rec.viewer.scene && rec.viewer.scene.screenSpaceCameraController;
    rec.cameraInputsBeforeFollow = controller && controller.enableInputs !== undefined ? controller.enableInputs : true;
    if (controller) controller.enableInputs = false;
    var canvas = rec.viewer.scene.canvas;
    if (canvas) {
      rec.followTouchActionBefore = canvas.style.touchAction;
      canvas.style.touchAction = "none";
    }
    try { rec.viewer.camera.cancelFlight(); } catch (e) {}
    var heading = headingFor(kind, record);
    rec.follow = {
      kind: kind, id: id, yaw: 0, pitch: 28, range: 3.1,
      camHeading: heading, lastCameraAt: now(),
      modelOffsetDeg: 0, autoOrbit: false, preset: "behind",
      lastFrameMs: 0, raf: null
    };
    if (kind === "adsb" && rec.prefs.aircraftDistance) {
      rec.follow.range = Math.max(0.1, (rec.prefs.aircraftDistance - 12) / aircraftModelLength(record));
    }
    rec.didAutoFit = true;
    updateFollowUi(rec);
    updateFollowCamera(rec, record, 0);
    setStatus(rec, "3D-Folgeansicht · " + (kind === "adsb" ? "ADS-B" : "AIS") + "-Kurs aktiv · Kamera frei schwenkbar");
    showToast(rec, "Kamera um das Ziel: ziehen = drehen, Mausrad = zoomen. Modell-Offset ist rein visuell; AIS-/ADS-B-Telemetrie bleibt unverändert.");
  }

  function stopFollow(rec, announce) {
    if (!rec) return;
    var follow = rec.follow;
    if (!follow) {
      rec.pendingFollowId = null;
      return;
    }
    if (follow.native && rec.viewer) {
      rec.viewer.trackedEntity = undefined;
    }
    if (follow.raf && window.cancelAnimationFrame) {
      try { window.cancelAnimationFrame(follow.raf); } catch (e) {}
    }
    var controller = rec.viewer && rec.viewer.scene && rec.viewer.scene.screenSpaceCameraController;
    if (controller && rec.cameraInputsBeforeFollow !== null && rec.cameraInputsBeforeFollow !== undefined) {
      controller.enableInputs = rec.cameraInputsBeforeFollow;
    }
    rec.cameraInputsBeforeFollow = null;
    var canvas = rec.viewer && rec.viewer.scene && rec.viewer.scene.canvas;
    if (canvas && rec.followTouchActionBefore !== undefined) canvas.style.touchAction = rec.followTouchActionBefore;
    rec.followTouchActionBefore = undefined;
    rec.follow = null;
    updateNativeCameraButton(rec);
    rec.pendingFollowId = null;
    var kind = follow.kind || (rec.spec && rec.spec.key) || "ais";
    var record = (RECORDS[kind] || {})[follow.id];
    var entity = rec.entities && rec.entities[kind + "-" + follow.id];
    if (record && entity) {
      if (kind === "ais") ensureShipModel(rec, entity, record);
      else ensureAircraftModel(rec, entity, record); /* clears temporary visual offset */
      if (entity.model && window.Cesium) {
        var C = window.Cesium, pos = positionFor(kind, record, C);
        entity.orientation = makeOrientation(kind, record, pos, C);
      }
    }
    updateFollowUi(rec);
    if (rec.viewer && rec.viewer.scene) {
      try { rec.viewer.scene.requestRender(); } catch (e2) {}
    }
    if (announce) showToast(rec, "Folgeansicht beendet · Modell wieder exakt nach AIS-/ADS-B-Kurs/Heading ausgerichtet.");
  }

  function updateFollowCamera(rec, record, dtHint) {
    if (!rec || !rec.viewer || !rec.follow || !record || !window.Cesium) return;
    var C = window.Cesium, follow = rec.follow;
    if (follow.native) {
      if (dtHint === undefined) return;
      var length = followModelLength(followTargetKind(rec), record);
      var distance = follow.range * length + (followTargetKind(rec) === "adsb" ? 12 : 15);
      var offset = followCameraLocal(headingFor(followTargetKind(rec), record), follow.yaw, follow.pitch, distance, 0);
      rec.viewer.camera.lookAtTransform(rec.viewer.camera.transform,
        new C.Cartesian3(offset.east, offset.north, offset.up));
      rec.viewer.scene.requestRender();
      return;
    }
    var kind = followTargetKind(rec);
    var modelLength = followModelLength(kind, record);
    var currentHeading = headingFor(kind, record);
    var stamp = now();
    var dt = dtHint === undefined ? Math.max(0, (stamp - (follow.lastCameraAt || stamp)) / 1000) : Number(dtHint);
    dt = clamp(isFinite(dt) ? dt : 0, 0, 0.5);
    var blend = 1 - Math.exp(-dt / 0.7);
    follow.camHeading = normalizeAngleDegrees(follow.camHeading + shortestAngleDelta(follow.camHeading, currentHeading) * blend);
    follow.lastCameraAt = stamp;
    var anchor = livePositionFor(rec, kind, record, C);
    var enu = C.Transforms.eastNorthUpToFixedFrame(anchor, C.Ellipsoid.WGS84);
    var aimHeight = Math.min(modelLength * 0.05, 12);
    var aim = C.Matrix4.multiplyByPoint(enu, new C.Cartesian3(0, 0, aimHeight), new C.Cartesian3());
    var range = follow.range * modelLength + (kind === "adsb" ? 12 : 15);
    var offset = followCameraLocal(follow.camHeading, follow.yaw, follow.pitch, range, aimHeight);
    var cameraPosition = C.Matrix4.multiplyByPoint(enu,
      new C.Cartesian3(offset.east, offset.north, offset.up), new C.Cartesian3());
    var cartographic = C.Cartographic.fromCartesian(cameraPosition);
    if (cartographic && cartographic.height < 3) {
      cartographic.height = 3;
      C.Cartographic.toCartesian(cartographic, C.Ellipsoid.WGS84, cameraPosition);
    }
    var direction = C.Cartesian3.normalize(C.Cartesian3.subtract(aim, cameraPosition, new C.Cartesian3()), new C.Cartesian3());
    var surfaceUp = C.Ellipsoid.WGS84.geodeticSurfaceNormal(cameraPosition, new C.Cartesian3());
    var right = C.Cartesian3.normalize(C.Cartesian3.cross(direction, surfaceUp, new C.Cartesian3()), new C.Cartesian3());
    var up = C.Cartesian3.normalize(C.Cartesian3.cross(right, direction, new C.Cartesian3()), new C.Cartesian3());
    rec.viewer.camera.setView({ destination: cameraPosition, orientation: { direction: direction, up: up } });
    try { rec.viewer.scene.requestRender(); } catch (e) {}
  }

  function setFollowPreset(rec, preset) {
    if (!rec || !rec.follow) return;
    var shots = {
      behind: { yaw: 0, pitch: 28 }, side: { yaw: 90, pitch: 22 },
      front: { yaw: 180, pitch: 28 }, above: { yaw: 0, pitch: 82 }
    };
    var shot = shots[preset];
    if (!shot) return;
    rec.follow.yaw = shot.yaw;
    rec.follow.pitch = shot.pitch;
    rec.follow.preset = preset;
    rec.follow.autoOrbit = false;
    var record = followRecord(rec);
    updateFollowUi(rec);
    if (record) updateFollowCamera(rec, record, 0.12);
  }

  function setFollowModelOffset(rec, value) {
    if (!rec || !rec.follow) return;
    var offset = clamp(Number(value) || 0, -180, 180);
    offset = Math.round(offset / 5) * 5;
    rec.follow.modelOffsetDeg = offset;
    var kind = followTargetKind(rec);
    var record = (RECORDS[kind] || {})[rec.follow.id];
    var entity = rec.entities && rec.entities[kind + "-" + rec.follow.id];
    if (record && window.Cesium) {
      var C = window.Cesium;
      var pos = livePositionFor(rec, kind, record, C);
      var entry = ((kind === "adsb" ? rec.aircraftModels : rec.shipModels) || {})[kind + "-" + rec.follow.id];
      if (entry && entry.model) {
        entry.modelMatrix = kind === "adsb" ? aircraftModelMatrix(rec, record, C, pos) : aisModelMatrix(record, C, offset, pos);
        entry.model.modelMatrix = entry.modelMatrix;
      }
      if (entity && entity.model) entity.orientation = displayOrientation(rec, kind, record, pos, C, true);
    }
    updateFollowUi(rec);
    if (rec.viewer && rec.viewer.scene) {
      try { rec.viewer.scene.requestRender(); } catch (e) {}
    }
  }

  function scheduleAutoOrbit(rec) {
    if (!rec || !rec.follow || !rec.follow.autoOrbit || !window.requestAnimationFrame) return;
    if (rec.follow.raf) return;
    var tick = function (stamp) {
      if (!rec.follow || !rec.follow.autoOrbit || !rec.viewer) {
        if (rec.follow) rec.follow.raf = null;
        return;
      }
      var follow = rec.follow;
      var dt = follow.lastFrameMs ? clamp((stamp - follow.lastFrameMs) / 1000, 0, 0.1) : 0;
      follow.lastFrameMs = stamp;
      follow.yaw = normalizeAngleDegrees(follow.yaw + 14 * dt);
      var record = (RECORDS[followTargetKind(rec)] || {})[follow.id];
      if (record) updateFollowCamera(rec, record, dt);
      follow.raf = window.requestAnimationFrame(tick);
    };
    rec.follow.raf = window.requestAnimationFrame(tick);
  }

  function toggleAutoOrbit(rec) {
    if (!rec || !rec.follow) return;
    rec.follow.autoOrbit = !rec.follow.autoOrbit;
    rec.follow.lastFrameMs = 0;
    updateFollowUi(rec);
    if (rec.follow.autoOrbit) scheduleAutoOrbit(rec);
  }

  // Wheel ownership is spatial: only the explicitly selected target/frame
  // owns aircraft zoom. Empty terrain must never snap to nearby traffic.
  function wheelHitsSelectedTarget(rec, event) {
    var selected = rec && rec.selection;
    var viewer = rec && rec.viewer, C = window.Cesium;
    if (!selected || !viewer || !C || !isFinite(event.clientX) || !isFinite(event.clientY)) return false;
    var canvas = viewer.scene.canvas;
    if (!canvas || !canvas.getBoundingClientRect) return false;
    var rect = canvas.getBoundingClientRect();
    var point = new C.Cartesian2(event.clientX - rect.left, event.clientY - rect.top);
    var picked = pickTrafficTarget(rec, point);
    if (picked && picked.kind === selected.kind && String(picked.id) === String(selected.id)) return true;
    // Native indicator uses the actual 68px path, NOT its transparent 160px SVG.
    try {
      var target = viewer.selectedEntity;
      var pos = target && target.position && target.position.getValue(viewer.clock.currentTime);
      if (!pos) return false;
      var xy = viewer.scene.cartesianToCanvasCoordinates(pos, new C.Cartesian2());
      if (!xy || xy.x < 0 || xy.y < 0 || xy.x > canvas.clientWidth || xy.y > canvas.clientHeight) return false;
      return Math.abs(point.x - xy.x) <= 36 && Math.abs(point.y - xy.y) <= 36;
    } catch (e) { return false; }
  }

  function installFollowInput(rec) {
    if (!rec || !rec.viewer || rec.followInputHandlers) return;
    var canvas = rec.viewer.scene.canvas;
    var pointers = Object.create(null), drag = null, pinch = null;
    var handlers = Object.create(null);
    function add(name, handler, capture, passive) {
      canvas.addEventListener(name, handler, { capture: !!capture, passive: !!passive });
      handlers[name] = { handler: handler, capture: !!capture };
    }
    function ids() { return Object.keys(pointers); }
    function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
    function setManual() {
      if (!rec.follow) return;
      rec.follow.autoOrbit = false;
      rec.follow.preset = "custom";
      if (rec.follow.raf && window.cancelAnimationFrame) window.cancelAnimationFrame(rec.follow.raf);
      rec.follow.raf = null;
      updateFollowUi(rec);
    }
    var down = function (event) {
      if (!rec.follow || rec.follow.native || (event.pointerType !== "touch" && event.button !== 0)) return;
      event.preventDefault();
      event.stopPropagation();
      pointers[event.pointerId] = { x: event.clientX, y: event.clientY, type: event.pointerType };
      try { canvas.setPointerCapture(event.pointerId); } catch (e) {}
      var list = ids();
      if (list.length === 1) {
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: rec.follow.yaw, pitch: rec.follow.pitch };
        pinch = null;
      } else if (list.length >= 2) {
        var a = pointers[list[0]], b = pointers[list[1]];
        pinch = { distance: distance(a, b), range: rec.follow.range };
        drag = null;
      }
    };
    var move = function (event) {
      if (!rec.follow || !pointers[event.pointerId]) return;
      event.preventDefault();
      event.stopPropagation();
      pointers[event.pointerId].x = event.clientX;
      pointers[event.pointerId].y = event.clientY;
      var list = ids();
      if (list.length >= 2 && pinch) {
        setManual();
        var a = pointers[list[0]], b = pointers[list[1]];
        rec.follow.range = clamp((pinch.range * pinch.distance) / distance(a, b), 0.7, 20);
        var target = followRecord(rec);
        if (target) updateFollowCamera(rec, target, 0.05);
        return;
      }
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      setManual();
      rec.follow.yaw = normalizeAngleDegrees(drag.yaw - dx * 0.35);
      rec.follow.pitch = clamp(drag.pitch + dy * 0.25, 5, 85);
      var record = followRecord(rec);
      if (record) updateFollowCamera(rec, record, 0.05);
    };
    var end = function (event) {
      if (!pointers[event.pointerId]) return;
      delete pointers[event.pointerId];
      var list = ids();
      if (!list.length) { drag = null; pinch = null; return; }
      if (list.length === 1 && rec.follow) {
        var remaining = list[0], point = pointers[remaining];
        drag = { id: Number(remaining), x: point.x, y: point.y, yaw: rec.follow.yaw, pitch: rec.follow.pitch };
        pinch = null;
      }
    };
    var wheel = function (event) {
      if (zoomSelectedAircraft(rec, event)) return;
      if (!rec.follow) return;
      if (rec.follow.native || !wheelHitsSelectedTarget(rec, event)) {
        // Over the focused model/frame keep native aircraft-distance zoom.
        if (rec.follow.native && wheelHitsSelectedTarget(rec, event)) return;
        // Tracking dolly only approaches the aircraft: terrain kilometres away
        // barely changes. Lens zoom magnifies the WHOLE scene at fixed distance.
        var frustum = rec.viewer.camera && rec.viewer.camera.frustum;
        if (!frustum || !isFinite(frustum.fov) || frustum.fov <= 0) return;
        var delta = Number(event.deltaY);
        if (!isFinite(delta) || delta === 0) return;
        if (event.deltaMode === 1) delta *= 16;
        else if (event.deltaMode === 2) delta *= (canvas.clientHeight || 800);
        event.preventDefault();
        event.stopPropagation();
        // Also prevent Cesium's same-canvas listener from queueing a dolly.
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        frustum.fov = clamp(frustum.fov * Math.exp(clamp(delta, -1200, 1200) * 0.0015),
          8 * Math.PI / 180, 100 * Math.PI / 180);
        try { rec.viewer.scene.requestRender(); } catch (e) {}
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      rec.follow.range = clamp(rec.follow.range * Math.exp(event.deltaY * 0.0015), 0.7, 20);
      var record = followRecord(rec);
      if (record) updateFollowCamera(rec, record, 0.05);
    };
    var reset = function (event) {
      if (!rec.follow || rec.follow.native) return;
      event.preventDefault();
      event.stopPropagation();
      rec.follow.yaw = 0; rec.follow.pitch = 28; rec.follow.range = 3.1;
      rec.follow.preset = "behind"; rec.follow.autoOrbit = false;
      if (rec.follow.raf && window.cancelAnimationFrame) window.cancelAnimationFrame(rec.follow.raf);
      rec.follow.raf = null;
      updateFollowUi(rec);
      var record = followRecord(rec);
      if (record) updateFollowCamera(rec, record, 0.12);
    };
    add("pointerdown", down, true, false);
    add("pointermove", move, true, false);
    add("pointerup", end, true, false);
    add("pointercancel", end, true, false);
    add("wheel", wheel, true, false);
    add("dblclick", reset, true, false);
    rec.followInputHandlers = handlers;
  }

  function showToast(rec, message) {
    if (!rec || !rec.win) return;
    var old = q(".dnx-am-toast", rec.win);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var toast = document.createElement("div");
    toast.className = "dnx-am-toast";
    toast.textContent = safeText(message);
    rec.win.appendChild(toast);
    window.setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3600);
  }

  // No second telemetry stream: native EntityView/SelectionIndicator receive
  // an invisible entity anchored to the very same rendered model/Entity.
  function installNativeFocusBounds(rec) {
    var C = window.Cesium, viewer = rec && rec.viewer;
    var display = viewer && viewer.dataSourceDisplay;
    if (!display || !display.getBoundingSphere || !C || !C.BoundingSphereState || rec.nativeFocusBoundsRestore) return;
    var original = display.getBoundingSphere;
    display.getBoundingSphere = function (entity, allowPartial, result) {
      // Cesium 1.121 Viewer only updates EntityView on DONE, not FAILED.
      // A graphics-free tracking proxy otherwise initializes once then freezes.
      // Resolve ONLY our proxies directly; unrelated loading entities must not
      // supply a stale scratch sphere or suspend this target's camera.
      if (entity && entity.__dnxFocusOwner === rec) {
        var pos = entity.position.getValue(viewer.clock.currentTime, result.center);
        if (!pos) return C.BoundingSphereState.FAILED;
        C.Cartesian3.clone(pos, result.center);
        result.radius = 1;
        return C.BoundingSphereState.DONE;
      }
      return original.call(this, entity, allowPartial, result);
    };
    rec.nativeFocusBoundsRestore = function () { display.getBoundingSphere = original; };
  }

  function pickTrafficTarget(rec, position) {
    var scene = rec.viewer.scene, hits;
    try { hits = scene.drillPick ? scene.drillPick(position) : [scene.pick(position)]; } catch(e) { return null; }
    var first = null, selected = rec.selection;
    for (var i = 0; i < hits.length; i++) {
      var target = pickedTarget(hits[i]);
      if (!target) continue;
      if (!first) first = target;
      // At overlapping aircraft, retain the explicitly selected identity rather
      // than switching to whichever exaggerated model is nearest this frame.
      if (selected && selected.kind === target.kind && selected.id === target.id) return target;
    }
    return first;
  }

  function nativeTargetFor(rec, kind, id) {
    var C = window.Cesium, viewer = rec && rec.viewer;
    if (!viewer || !viewer.entities || !C || (!C.CallbackPositionProperty && !C.CallbackProperty)) return null;
    installNativeFocusBounds(rec);
    var key = kind + "-" + id;
    rec.nativeTargets = rec.nativeTargets || Object.create(null);
    if (rec.nativeTargets[key]) return rec.nativeTargets[key];
    var callback = function (time, result) {
      var record = (RECORDS[kind] || {})[id];
      if (!record) return undefined;
      var models = kind === "adsb" ? rec.aircraftModels : rec.shipModels;
      var entry = models && models[key];
      var sphere = entry && !entry.cancelled && entry.model && entry.model.ready !== false && entry.model.boundingSphere;
      var entity = rec.entities && rec.entities[key];
      var pos = sphere && sphere.center;
      if (!pos && entity && entity.position && entity.position.getValue) pos = entity.position.getValue(time);
      if (!pos) return undefined;
      return C.Cartesian3.clone(pos, result);
    };
    var property;
    if (C.CallbackPositionProperty) property = new C.CallbackPositionProperty(callback, false);
    else {
      // Cesium 1.121 has CallbackProperty, but not CallbackPositionProperty.
      // EntityView/VelocityVectorProperty also require the PositionProperty
      // reference-frame contract; a plain CallbackProperty is insufficient.
      property = new C.CallbackProperty(callback, false);
      property.referenceFrame = C.ReferenceFrame.FIXED;
      property.getValueInReferenceFrame = function (time, referenceFrame, result) {
        var value = callback(time, result);
        if (!value) return undefined;
        return C.PositionProperty.convertToReferenceFrame(time, value,
          C.ReferenceFrame.FIXED, referenceFrame, result);
      };
    }
    var record = (RECORDS[kind] || {})[id];
    var entity = viewer.entities.add({ id: "dnx-focus-" + key,
      name: record ? recordLabel(kind, record) : id, position: property });
    entity.__dnxFocusOwner = rec;
    rec.nativeTargets[key] = entity;
    return entity;
  }

  function updateNativeCameraButton(rec) {
    if (!rec || !rec.infoPanel) return;
    var button = q('[data-info-action="camera"]', rec.infoPanel);
    if (!button) return;
    var tracking = !!(rec.follow && rec.follow.id === String(rec.infoId) &&
      followTargetKind(rec) === rec.infoKind);
    button.setAttribute("aria-pressed", tracking ? "true" : "false");
    button.title = tracking ? "Kameraverfolgung beenden" : "Kamera folgt diesem Ziel";
    button.classList.toggle("tracking", tracking);
    var play = q('[data-info-action="play"]', rec.infoPanel);
    var stop = q('[data-info-action="stop-camera"]', rec.infoPanel);
    var status = q('[data-target-status]', rec.infoPanel);
    if (play) { play.disabled = tracking; play.textContent = tracking ? "▶ Läuft" : "▶ Play"; }
    if (stop) stop.disabled = !tracking;
    if (status) {
      var record=(RECORDS[rec.infoKind] || {})[rec.infoId];
      var age=record && record.lastPositionAt ? Math.max(0,Math.floor((now()-record.lastPositionAt)/1000)) : null;
      status.textContent=(tracking ? "Kamera folgt" : "Ziel ausgewählt · Play startet Kamera") +
        (age === null ? " · Positionszeit unbekannt" : " · Position " + age + " s alt" + (age>=60 ? " · Vorausberechnung angehalten" : ""));
    }
    var offset = q('[data-target-offset]', rec.infoPanel);
    if (offset && !rec.__targetOffsetDragging && document.activeElement !== offset) offset.value = tracking ? rec.follow.modelOffsetDeg || 0 : 0;
    var value = q('[data-target-offset-value]', rec.infoPanel);
    if (value) value.textContent = (tracking ? rec.follow.modelOffsetDeg || 0 : 0) + "°";
  }

  function ensureTargetFollow(rec, kind, id) {
    if (!rec.follow || rec.follow.id !== String(id) || followTargetKind(rec) !== kind) startFollowTarget(rec, String(id));
  }

  function buildTargetControls(rec, kind, id) {
    var holder = q(".dnx-am-target-controls", rec.infoPanel);
    if (!holder) return;
    function choice(labelText, items, current, onChange) {
      var label = document.createElement("label"), text = document.createElement("span");
      label.setAttribute("data-target-control", labelText);
      text.textContent = labelText;
      var select = document.createElement("select");
      select.setAttribute("aria-label", labelText);
      items.forEach(function (item) {
        var option = document.createElement("option");
        option.value = String(item[0]); option.textContent = item[1];
        option.selected = String(item[0]) === String(current); select.appendChild(option);
      });
      select.addEventListener("change", function () { onChange(select.value); });
      label.appendChild(text); label.appendChild(select); holder.appendChild(label);
    }
    var status = document.createElement("small");status.setAttribute("data-target-status", "");holder.appendChild(status);
    choice("A → B Spuren", [["selected","Nur fokussiertes Ziel"],["all","Alle Ziele"],["off","Keine"]], rec.prefs.tracks ? rec.prefs.groundTracks || "all" : "off",
      function(v){rec.prefs.groundTracks=v;rec.prefs.tracks=v!=="off";applyTrackSettings(rec);});
    choice("Spurfarbe", [["auto","Automatisch"],["#17212b","Dunkel"],["#ffffff","Weiß"],["#ffcc00","Gelb"],["#ff5533","Rot"],["#00bfff","Hellblau"],["#00cc88","Grün"],["#cc66ff","Violett"]], rec.prefs.trackColor || "auto",
      function(v){rec.prefs.trackColor=v;applyTrackSettings(rec);});
    var record = (RECORDS[kind] || {})[id];
    if (record) choice("Info-Bereich", infoPages(kind, record).map(function(page,index){return [index,page.title];}), 0,
      function(v){rec.infoIndex=Number(v);renderInfoPage(rec);});
    if (kind === "adsb") {
      choice("Flugzeuggröße · alle", [[1,"Normal"],[1.5,"1,5×"],[2,"2×"],[3,"3×"]], aircraftSizeFactor(rec), function (v) { setAircraftSize(rec,v); });
      choice("Kamera-Abstand", [[0,"Bitte wählen"],[100,"100 m"],[250,"250 m"],[500,"500 m"],[1000,"1 km"],[3000,"3 km"]], rec.prefs.aircraftDistance || 0,
        function(v) { setAircraftDistance(rec,id,v); });
    }
    choice("Kameraansicht", [["behind","Hinten"],["side","Seite"],["front","Vorne"],["above","Oben"]], "behind",
      function(v) { ensureTargetFollow(rec,kind,id);setFollowPreset(rec,v); });
    var offsetLabel = document.createElement("label"), text = document.createElement("span");
    text.textContent = "Modell-Offset";
    var range = document.createElement("input");range.type="range";range.min="-180";range.max="180";range.step="5";
    range.setAttribute("data-target-offset", "");range.setAttribute("aria-label","Modell-Offset · rein visuell");
    var value = document.createElement("span");value.setAttribute("data-target-offset-value", "");value.textContent="0°";
    range.addEventListener("pointerdown",function(){rec.__targetOffsetDragging=true;});
    function release(){rec.__targetOffsetDragging=false;}
    range.addEventListener("pointerup",release);range.addEventListener("pointercancel",release);range.addEventListener("blur",release);
    range.addEventListener("input",function(){ensureTargetFollow(rec,kind,id);setFollowModelOffset(rec,range.value);value.textContent=range.value+"°";});
    range.addEventListener("change",release);
    offsetLabel.setAttribute("data-target-control", "Modell-Offset");
    offsetLabel.appendChild(text);offsetLabel.appendChild(range);offsetLabel.appendChild(value);holder.appendChild(offsetLabel);
    var actions = document.createElement("div");actions.className="dnx-am-target-actions";
    [["zoom","Auf Ziel zoomen"],["offset-reset","Offset zurücksetzen"],["orbit","Auto-Umlauf an/aus"],["replay","Spur abspielen"],["stop-replay","Spur stoppen"]].forEach(function(item){
      var button=document.createElement("button");button.type="button";button.setAttribute("data-info-action",item[0]);button.textContent=item[1];actions.appendChild(button);
    });holder.appendChild(actions);
    var note=document.createElement("small");note.textContent="Play = Kameraverfolgung · Spur abspielen = gespeicherter Verlauf. Das Spur-Ende folgt der zeitlich begrenzten Vorausberechnung. Ohne Kurs/Geschwindigkeit oder neue Positionen kann ein Ziel stehen bleiben. Offset/Größe ändern keine Empfangsdaten.";holder.appendChild(note);
  }

  function toggleSelectedCamera(rec) {
    if (!rec) return;
    var kind = rec.infoPanel ? rec.infoKind : rec.selection && rec.selection.kind;
    var id = rec.infoPanel ? rec.infoId : rec.selection && rec.selection.id;
    if (!id) return;
    if (rec.follow && rec.follow.id === String(id) && followTargetKind(rec) === kind) stopFollow(rec, true);
    else startFollowTarget(rec, String(id));
  }

  function selectTrafficTarget(rec, kind, id) {
    if (!rec) return;
    rec.selection = (kind === "adsb" || kind === "ais") && id ? { kind: kind, id: String(id) } : null;
    if (rec.viewer && rec.viewer.selectionIndicator) {
      rec.viewer.selectedEntity = rec.selection ? nativeTargetFor(rec, kind, String(id)) : undefined;
    }
    if (rec.selection && rec.win && rec.win.isConnected &&
        (!rec.infoPanel || rec.infoKind !== kind || String(rec.infoId) !== String(id))) {
      openInfoSlideshow(rec, kind, String(id), false);
    }
    if (rec.map2d) syncMap2D(rec);
    updateSelectionFrame(rec);
    if (rec.viewer && rec.prefs.groundTracks === "selected") applyTrackSettings(rec);
    if (rec.viewer && rec.viewer.scene) rec.viewer.scene.requestRender();
  }
  function updateSelectionFrame(rec) {
    if (!rec || !rec.win) return;
    var frame = q("[data-am-selection-frame]", rec.win);
    if (!frame) return;
    frame.hidden = true;
    if (rec.viewer && rec.viewer.selectionIndicator) {
      var selected = rec.selection && nativeTargetFor(rec, rec.selection.kind, rec.selection.id);
      if (rec.viewer.selectedEntity !== (selected || undefined)) rec.viewer.selectedEntity = selected || undefined;
      var vm = rec.viewer.selectionIndicator.viewModel;
      if (vm) {
        var anchor = selected && selected.position.getValue(rec.viewer.clock.currentTime);
        vm.position = anchor;
        vm.showSelection = !!anchor;
        vm.update();
      }
      var colors = trackContrast2D(rec.prefs.baseMap);
      var indicator = rec.viewer.selectionIndicator.container;
      var svg = indicator && indicator.querySelector(".cesium-selection-wrapper svg");
      if (svg) {
        var key = colors.color + colors.outline;
        if (rec.__nativeIndicatorKey !== key) {
          svg.style.fill = "none";
          svg.style.stroke = colors.color;
          svg.style.strokeWidth = "2px";
          svg.style.filter = "drop-shadow(0 0 1px " + colors.outline + ")";
          var path = svg.querySelector("path");
          if (path) path.setAttribute("d", "M -34 -34 L 34 -34 L 34 34 L -34 34 Z");
          rec.__nativeIndicatorKey = key;
        }
      }
      if (rec.follow && rec.follow.native && (!rec.viewer.trackedEntity ||
          !(RECORDS[followTargetKind(rec)] || {})[rec.follow.id])) stopFollow(rec, false);
      updateNativeCameraButton(rec);
      return;
    }
    var selection = rec.selection;
    var C = window.Cesium, viewer = rec.viewer;
    if (!selection || !viewer || !C || selection.kind !== "adsb") return;
    var record = RECORDS.adsb[selection.id];
    if (!record || !validPosition(record.lat, record.lon)) return;
    try {
      var scene = viewer.scene;
      var pos = livePositionFor(rec, "adsb", record, C);
      var entry = (rec.aircraftModels || {})["adsb-" + selection.id];
      var radius = aircraftModelLength(record) * aircraftSizeFactor(rec) / 2;
      if (entry && entry.model && entry.model.boundingSphere) {
        pos = entry.model.boundingSphere.center;
        radius = entry.model.boundingSphere.radius;
      } else {
        /* The fallback is rendered by Cesium at viewer.clock.currentTime.
           Its sampled position may differ from our wall-clock prediction.
           A selection frame must follow what is actually on screen. */
        var entity = (rec.entities || {})["adsb-" + selection.id];
        if (entity && entity.position && typeof entity.position.getValue === "function") {
          pos = entity.position.getValue(viewer.clock.currentTime);
          if (!pos) return;
        }
      }
      var camera = viewer.camera;
      var delta = C.Cartesian3.subtract(pos, camera.positionWC, new C.Cartesian3());
      if (C.Cartesian3.dot(delta, camera.directionWC) <= 0) return;
      var xy = scene.cartesianToCanvasCoordinates(pos, new C.Cartesian2());
      var canvas = scene.canvas;
      if (!xy || xy.x < 0 || xy.y < 0 || xy.x > canvas.clientWidth || xy.y > canvas.clientHeight) return;
      var distance = Math.max(1, C.Cartesian3.magnitude(delta));
      var fovy = camera.frustum.fovy || Math.PI / 3;
      var projected = radius * canvas.clientHeight / (distance * Math.tan(fovy / 2));
      var size = clamp(Math.max(50 * aircraftSizeFactor(rec), projected) + 12, 44, 180);
      /* Canvas coordinates are local CSS pixels; account for a different
         positioned parent (and external CSS scaling) before placing overlay. */
      var originX = 0, originY = 0;
      if (canvas.getBoundingClientRect && frame.offsetParent && frame.offsetParent.getBoundingClientRect) {
        var canvasRect = canvas.getBoundingClientRect();
        var parent = frame.offsetParent;
        var parentRect = parent.getBoundingClientRect();
        var scaleX = parent.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
        var scaleY = parent.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
        originX = (canvasRect.left - parentRect.left) / (scaleX || 1) - (parent.clientLeft || 0);
        originY = (canvasRect.top - parentRect.top) / (scaleY || 1) - (parent.clientTop || 0);
      }
      frame.style.left = (originX + xy.x - size / 2) + "px";
      frame.style.top = (originY + xy.y - size / 2) + "px";
      frame.style.width = size + "px"; frame.style.height = size + "px";
      var contrast = trackContrast2D(rec.prefs && rec.prefs.baseMap);
      frame.style.borderColor = contrast.color;
      frame.style.boxShadow = "0 0 0 1px " + contrast.outline + ",inset 0 0 0 1px " + contrast.outline;
      frame.hidden = false;
    } catch (e) { /* A target outside the projectable scene has no screen frame. */ }
  }

  function pickedTarget(picked) {
    if (!picked) return null;
    var id = picked.id;
    if (id && typeof id === "object" && id.id !== undefined) id = id.id;
    if (typeof id !== "string" && picked.primitive) {
      id = picked.primitive.id;
      if (id && typeof id === "object" && id.id !== undefined) id = id.id;
    }
    if (typeof id !== "string") return null;
    var match = /^(ais|adsb)-(.+)$/.exec(id);
    return match ? { kind: match[1], id: match[2] } : null;
  }

  function hideContextMenu() {
    if (!contextMenu) return;
    var menu = contextMenu;
    contextMenu = null;
    if (menu.__outsideHandler) document.removeEventListener("pointerdown", menu.__outsideHandler, true);
    if (menu.parentNode) { try { menu.parentNode.removeChild(menu); } catch (e) {} }
  }

  function installTrafficZoom(rec) {
    if (!rec || !rec.viewer || rec.trafficZoomHandler) return;
    var canvas = rec.viewer.scene && rec.viewer.scene.canvas;
    if (!canvas) return;
    var handler = function (event) {
      if (zoomSelectedAircraft(rec, event)) return;
      if (rec.follow || !wheelHitsSelectedTarget(rec, event)) return;
      var C = window.Cesium, selected = rec.selection;
      var record = (RECORDS[selected.kind] || {})[selected.id];
      if (!record) return;
      var focus = livePositionFor(rec, selected.kind, record, C);
      if (!focus) return;
      event.preventDefault(); event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      var cam = rec.viewer.camera;
      var offset = C.Cartesian3.subtract(cam.positionWC || cam.position, focus, new C.Cartesian3());
      var dist = C.Cartesian3.magnitude(offset);
      if (!isFinite(dist) || dist < 1) dist = 800;
      var dir = C.Cartesian3.divideByScalar(offset, dist, new C.Cartesian3());
      var delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (canvas.clientHeight || 800) : 1);
      dist = clamp(dist * Math.exp(delta * 0.0015), 45, 25000000);
      var pos = C.Cartesian3.add(focus, C.Cartesian3.multiplyByScalar(dir, dist, new C.Cartesian3()), new C.Cartesian3());
      var look = C.Cartesian3.normalize(C.Cartesian3.subtract(focus, pos, new C.Cartesian3()), new C.Cartesian3());
      var upV = C.Ellipsoid.WGS84.geodeticSurfaceNormal(pos, new C.Cartesian3());
      cam.setView({ destination: pos, orientation: { direction: look, up: upV } });
      try { rec.viewer.scene.requestRender(); } catch (e) {}
    };
    canvas.addEventListener("wheel", handler, true);
    rec.trafficZoomHandler = handler;
  }

  function zoomToRecord(rec, kind, id) {
    var record = (RECORDS[kind] || {})[id];
    if (!record || !validPosition(asNumber(record.lat), asNumber(record.lon))) {
      showToast(rec, "Keine aktuelle Schiffs-/Flugzeugposition verfügbar.");
      return;
    }
    if (rec.follow) stopFollow(rec, false);
    if (rec.map2d) rec.map2d.setView([record.lat, record.lon], kind === "ais" ? 14 : 11, { animate: true });
    if (rec.viewer && window.Cesium) {
      var C = window.Cesium;
      if (kind === "ais") {
        rec.viewer.camera.flyTo({
          destination: C.Cartesian3.fromDegrees(record.lon, record.lat, aisFocusHeight(record)),
          duration: 0.8
        });
      } else {
        /* Airborne framing: the camera stays at flight level near the aircraft
           (like the follow shot), so zooming in approaches the plane instead of
           diving to the ground underneath it. */
        var shot = adsbFocusCamera(record, C);
        rec.viewer.camera.flyTo({
          destination: shot.destination,
          orientation: shot.orientation,
          duration: 0.8
        });
      }
    }
  }

  function adsbFocusCamera(record, C) {
    var alt = Math.max(150, Number(record.altitudeM) || 0);
    var plane = C.Cartesian3.fromDegrees(record.lon, record.lat, alt);
    var anchor = C.Cartesian3.fromDegrees(record.lon, record.lat, 0);
    var enu = C.Transforms.eastNorthUpToFixedFrame(anchor, C.Ellipsoid.WGS84);
    var heading = Number(record.headingDeg);
    if (!isFinite(heading)) heading = Number(record.trackDeg);
    if (!isFinite(heading)) heading = 0;
    var hRad = heading * Math.PI / 180;
    var behind = 700, right = 240, up = alt + 260;
    var east = behind * -Math.sin(hRad) + right * Math.cos(hRad);
    var north = behind * -Math.cos(hRad) - right * Math.sin(hRad);
    var camPos = C.Matrix4.multiplyByPoint(enu, new C.Cartesian3(east, north, up), new C.Cartesian3());
    var dir = C.Cartesian3.normalize(C.Cartesian3.subtract(plane, camPos, new C.Cartesian3()), new C.Cartesian3());
    var upV = C.Ellipsoid.WGS84.geodeticSurfaceNormal(camPos, new C.Cartesian3());
    return { destination: camPos, orientation: { direction: dir, up: upV } };
  }

  function showContextMenu(rec, kind, id, x, y) {
    // Right-click reaches the same docked target controls, never a cursor menu.
    if (!(RECORDS[kind] || {})[id]) return;
    hideContextMenu();
    selectTrafficTarget(rec, kind, id);
    if (!rec.infoPanel || rec.infoKind !== kind || String(rec.infoId) !== String(id))
      openInfoSlideshow(rec, kind, String(id), false);
  }

  function navStatusText(value) {
    var labels = {
      0: "Fahrt unter Motor", 1: "Vor Anker", 2: "Manövrierunfähig", 3: "Manövrierbehindert",
      4: "Tiefgang beschränkt", 5: "Festgemacht", 6: "Auf Grund", 7: "Fischend",
      8: "Segelnd", 9: "Sonderstatus", 10: "Sonderstatus", 11: "Schleppbetrieb", 12: "Schleppbetrieb",
      13: "Sonderstatus", 14: "AIS-SART aktiv", 15: "Keine Angabe"
    };
    return value === null || value === undefined ? "—" : (labels[value] || ("Status " + value));
  }

  function displayValue(value, suffix) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "number" && !isFinite(value)) return "—";
    return String(value) + (suffix || "");
  }

  function formatCoordinate(value) {
    var n = asNumber(value);
    return n === null ? "—" : n.toFixed(5) + "°";
  }

  function formatSeen(value) {
    var n = asNumber(value);
    return n === null ? "—" : new Date(n).toLocaleString("de-DE");
  }

  function photoPlainText(value) {
    var text = String(value === null || value === undefined ? "" : value);
    try {
      if (typeof DOMParser !== "undefined") {
        return new DOMParser().parseFromString(text, "text/html").body.textContent || "";
      }
    } catch (e) {}
    return text.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }

  function normalizePhotoText(value) {
    var text = photoPlainText(value).toLowerCase();
    try { if (text.normalize) text = text.normalize("NFKD"); } catch (e) {}
    return text.replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  }

  function shipPhotoName(record) {
    return normalizePhotoText(record && record.name)
      .replace(/^(?:m v|m s|m t|mv|ms|mt|t v|ss)\s+/, "").trim();
  }

  function commonsPages(query) {
    if (!query || typeof fetch !== "function") return Promise.resolve([]);
    var params = new URLSearchParams();
    params.set("action", "query");
    params.set("format", "json");
    params.set("formatversion", "2");
    params.set("origin", "*");
    params.set("generator", "search");
    params.set("gsrnamespace", "6");
    params.set("gsrlimit", "8");
    params.set("gsrsearch", query);
    params.set("prop", "imageinfo|info");
    params.set("inprop", "url");
    params.set("iiprop", "url|extmetadata");
    params.set("iiurlwidth", "720");
    return fetch(COMMONS_API + "?" + params.toString(), { credentials: "omit", cache: "force-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("Commons HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        return data && data.query && Array.isArray(data.query.pages) ? data.query.pages : [];
      });
  }

  function imageCandidate(page) {
    if (!page) return null;
    var info = Array.isArray(page.imageinfo) ? page.imageinfo[0] : null;
    if (!info || !info.thumburl) return null;
    var src = "";
    try {
      var parsed = new URL(info.thumburl, window.location.href);
      var host = parsed.hostname.toLowerCase();
      if (parsed.protocol !== "https:" || (host !== "wikimedia.org" && host.slice(-14) !== ".wikimedia.org")) return null;
      src = parsed.href;
    } catch (e) { return null; }
    if (String(info.mime || "").toLowerCase() === "image/svg+xml") return null;
    var metadata = info.extmetadata || {};
    var artist = photoPlainText(metadata.Artist && metadata.Artist.value ||
                                metadata.Credit && metadata.Credit.value || "");
    var license = photoPlainText(metadata.LicenseShortName && metadata.LicenseShortName.value || "");
    var pageUrl = "https://commons.wikimedia.org/wiki/" +
      encodeURIComponent(String(page.title || "").replace(/ /g, "_"));
    return {
      src: src,
      title: String(page.title || "Wikimedia Commons photo").replace(/^File:/, ""),
      description: photoPlainText(metadata.ImageDescription && metadata.ImageDescription.value || ""),
      artist: safeText(artist).replace(/\s+/g, " ").slice(0, 120),
      license: safeText(license).replace(/\s+/g, " ").slice(0, 60) || "Lizenz auf Commons-Seite",
      pageUrl: pageUrl
    };
  }

  function exactShipPhotoScore(page, record) {
    var photo = imageCandidate(page);
    if (!photo) return -1;
    var title = normalizePhotoText(photo.title);
    var description = normalizePhotoText(photo.description);
    var allText = title + " " + description;
    var score = 0, matched = false;
    var name = shipPhotoName(record);
    if (name.length >= 3) {
      if (title.indexOf(name) >= 0) { score += 120; matched = true; }
      else if (description.indexOf(name) >= 0) { score += 70; matched = true; }
    }
    var imo = String(record && record.imo || "").replace(/[^0-9]/g, "");
    var mmsi = String(record && record.mmsi || "").replace(/[^0-9]/g, "");
    if (imo.length >= 7 && allText.indexOf(imo) >= 0) { score += 240; matched = true; }
    if (mmsi.length >= 7 && allText.indexOf(mmsi) >= 0) { score += 240; matched = true; }
    if (["model", "scale model", "maquette", "miniature"].some(function (term) { return allText.indexOf(term) >= 0; })) score -= 200;
    return matched && score > 0 ? score : -1;
  }

  function typeShipPhotoScore(page, kind) {
    var photo = imageCandidate(page);
    if (!photo) return -1;
    var expected = normalizePhotoText(PHOTO_TYPE_SEARCH[kind] || "ship vessel").split(" ").filter(Boolean);
    var allText = normalizePhotoText(photo.title + " " + photo.description);
    if (["model", "scale model", "maquette", "miniature", "toy"].some(function (term) { return allText.indexOf(term) >= 0; })) return -1;
    var matched = 0;
    expected.forEach(function (term) { if (term.length > 2 && allText.indexOf(term) >= 0) matched++; });
    return matched >= Math.max(1, Math.ceil(expected.length * 0.6)) ? matched : -1;
  }

  function bestPhoto(pages, scoreFunction, recordOrKind) {
    var best = null, bestScore = -1;
    (pages || []).forEach(function (page) {
      var score = scoreFunction(page, recordOrKind);
      if (score > bestScore) {
        var photo = imageCandidate(page);
        if (photo) { best = photo; bestScore = score; }
      }
    });
    return best;
  }

  function exactShipPhotoQueries(record) {
    var name = shipPhotoName(record).slice(0, 80);
    var imo = String(record && record.imo || "").replace(/[^0-9]/g, "");
    var mmsi = String(record && record.mmsi || "").replace(/[^0-9]/g, "");
    var queries = [];
    function add(query) { if (query && queries.indexOf(query) < 0) queries.push(query); }
    if (imo.length >= 7) add('"' + imo + '"');
    if (name.length >= 3) add('"' + name + '"');
    if (mmsi.length >= 7) add('"' + mmsi + '"');
    return queries;
  }

  function findExactShipPhoto(record, queries, index) {
    if (index >= queries.length) return Promise.resolve(null);
    return commonsPages(queries[index]).then(function (pages) {
      var exact = bestPhoto(pages, exactShipPhotoScore, record);
      if (exact) { exact.match = "exact"; return exact; }
      return findExactShipPhoto(record, queries, index + 1);
    });
  }

  function getShipPhoto(record) {
    var key = [record && record.imo || "", record && record.mmsi || "",
               shipPhotoName(record), record && record.kindName || "generic"].join("|");
    if (SHIP_PHOTO_CACHE[key]) return SHIP_PHOTO_CACHE[key];
    var exactQueries = exactShipPhotoQueries(record);
    var promise = findExactShipPhoto(record, exactQueries, 0).catch(function () { return null; }).then(function (exact) {
      if (exact) return exact;
      var typeTerm = PHOTO_TYPE_SEARCH[record && record.kindName] || PHOTO_TYPE_SEARCH.generic;
      var typeQuery = typeTerm.indexOf("ship") >= 0 ? typeTerm : typeTerm + " ship";
      return commonsPages(typeQuery).then(function (typePages) {
        var illustrative = bestPhoto(typePages, typeShipPhotoScore, record && record.kindName || "generic");
        if (illustrative) illustrative.match = "type";
        return illustrative;
      }).catch(function () { return null; });
    });
    SHIP_PHOTO_CACHE[key] = promise;
    return promise;
  }

  function aircraftTypeName(record) {
    var code = safeText(record && record.aircraft).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code) code = safeText(record && record.type).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code) code = safeText(record && record.category).toUpperCase().replace(/[^A-Z0-9]/g, "");
    return ADSB_TYPE_NAMES[code] || code;
  }

  function aircraftRegistration(record) {
    var candidates = [record && record.registration, record && record.reg, record && record.aircraft];
    for (var i = 0; i < candidates.length; i++) {
      var value = String(candidates[i] || "").trim().toUpperCase();
      if (/^[A-Z0-9]{1,3}-[A-Z0-9]{2,6}$/.test(value) || /^N[0-9]{1,5}[A-Z]{0,2}$/.test(value) ||
          /^JA[0-9A-Z]{4}$/.test(value) || /^HL[0-9]{4}$/.test(value)) return value;
    }
    return "";
  }
  function aircraftExternalLinks(record) {
    var reg = aircraftRegistration(record);
    var hex = String(record && (record.icao || record.id) || "").toUpperCase();
    var flight = String(record && record.flight || "").trim().toUpperCase();
    var links = [];
    if (/^[A-F0-9]{6}$/.test(hex)) {
      links.push({ label: "ADSB.lol · Live-Ziel", url: "https://globe.adsb.lol/?icao=" + hex.toLowerCase() });
      links.push({ label: "ADS-B Exchange · Live-Ziel", url: "https://globe.adsbexchange.com/?icao=" + hex.toLowerCase() });
    }
    if (reg) {
      links.push({ label: "Planespotters · Fotos / " + reg, url: "https://www.planespotters.net/photos/reg/" + encodeURIComponent(reg) });
      links.push({ label: "JetPhotos · Fotos / " + reg, url: "https://www.jetphotos.com/registration/" + encodeURIComponent(reg) });
      links.push({ label: "Flightradar24 · Flugzeug", url: "https://www.flightradar24.com/data/aircraft/" + encodeURIComponent(reg.toLowerCase()) });
    }
    if (/^[A-Z0-9]{3,10}$/.test(flight)) links.push({ label: "FlightAware · Rufzeichen", url: "https://www.flightaware.com/live/flight/" + encodeURIComponent(flight) });
    links.push({ label: "Wikimedia Commons · Fotosuche", url: "https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=" + encodeURIComponent(reg || hex || flight || "aircraft") });
    return links;
  }
  function appendAircraftLinks(parent, record) {
    aircraftExternalLinks(record).forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = item.label + " ↗";
      a.style.cssText = "display:inline-block;color:#bde4ff;padding:4px 7px;text-decoration:underline;font-size:11px";
      parent.appendChild(a);
    });
  }

  function aircraftPhotoQueries(record) {
    var queries = [];
    function add(query) { if (query && queries.indexOf(query) < 0) queries.push(query); }
    var flight = safeText(record && record.flight).toUpperCase().replace(/\s+/g, "");
    var name = aircraftTypeName(record);
    var key = adsbModelAssetKey(record);
    var registration = aircraftRegistration(record);
    if (registration) {
      add('"' + registration + '" aircraft');
      add('"' + registration.replace(/-/g, " ") + '" aircraft');
    }
    var hex = String(record && (record.icao || record.id) || "").toUpperCase();
    if (/^[A-F0-9]{6}$/.test(hex)) add('"' + hex + '" aircraft');
    if (name.length >= 3) add('"' + name + '" aircraft');
    if (key && PHOTO_TYPE_SEARCH_ADSB[key]) add(PHOTO_TYPE_SEARCH_ADSB[key]);
    return queries;
  }

  function exactAircraftPhotoScore(page, record) {
    var photo = imageCandidate(page);
    if (!photo) return -1;
    var title = normalizePhotoText(photo.title);
    var description = normalizePhotoText(photo.description);
    var allText = title + " " + description;
    var score = 0, matched = false;
    var registration = aircraftRegistration(record);
    var registrationWords = normalizePhotoText(registration);
    /* Require registration/ICAO identity, never just a rotating flight number. */
    if (registrationWords && (" " + allText + " ").indexOf(" " + registrationWords + " ") >= 0) {
      score += 300; matched = true;
    }
    var icao = normalizePhotoText(record && record.icao || record && record.id || "");
    if (/^[a-f0-9]{6}$/.test(icao) && (" " + allText + " ").indexOf(" " + icao + " ") >= 0) { score += 240; matched = true; }
    var name = normalizePhotoText(aircraftTypeName(record));
    if (name.length >= 3 && allText.indexOf(name) >= 0) score += 40;
    if (["model", "scale model", "maquette", "miniature", "toy", "cockpit", "cabin", "interior", "diagram", "drawing"].some(function (term) { return allText.indexOf(term) >= 0; })) score -= 200;
    return matched && score > 0 ? score : -1;
  }

  function typeAircraftPhotoScore(page, record) {
    var photo = imageCandidate(page);
    if (!photo) return -1;
    var allText = normalizePhotoText(photo.title + " " + photo.description);
    if (["model", "scale model", "maquette", "miniature", "toy", "cockpit", "cabin", "interior", "diagram", "drawing"].some(function (term) { return allText.indexOf(term) >= 0; })) return -1;
    var expected = normalizePhotoText(aircraftTypeName(record) + " " +
      (PHOTO_TYPE_SEARCH_ADSB[adsbModelAssetKey(record)] || "airliner aircraft")).split(" ").filter(Boolean);
    var matched = 0;
    expected.forEach(function (term) { if (term.length > 2 && allText.indexOf(term) >= 0) matched++; });
    return matched >= Math.max(1, Math.ceil(expected.length * 0.5)) ? matched : -1;
  }

  function findExactAircraftPhoto(record, queries, index) {
    if (index >= queries.length) return Promise.resolve(null);
    return commonsPages(queries[index]).then(function (pages) {
      var exact = bestPhoto(pages, exactAircraftPhotoScore, record);
      if (exact) { exact.match = "exact"; return exact; }
      return findExactAircraftPhoto(record, queries, index + 1);
    });
  }

  function getAircraftPhoto(record) {
    var key = [record && record.icao || record && record.id || "", aircraftRegistration(record),
               aircraftTypeName(record), adsbModelAssetKey(record) || "generic"].join("|");
    if (AIRCRAFT_PHOTO_CACHE[key]) return AIRCRAFT_PHOTO_CACHE[key];
    var queries = aircraftPhotoQueries(record);
    var promise = findExactAircraftPhoto(record, queries, 0).catch(function () { return null; }).then(function (exact) {
      if (exact) return exact;
      return commonsPages(queries[queries.length - 1] || PHOTO_TYPE_SEARCH_ADSB.generic).then(function (typePages) {
        var illustrative = bestPhoto(typePages, typeAircraftPhotoScore, record);
        if (illustrative) illustrative.match = "type";
        return illustrative;
      }).catch(function () { return null; });
    });
    AIRCRAFT_PHOTO_CACHE[key] = promise;
    return promise;
  }

  function renderShipPhoto(rec, record) {
    if (!rec || !rec.infoPanel) return;
    var holder = q(".dnx-am-info-photo", rec.infoPanel);
    if (!holder) return;
    var photoKind = rec.infoKind;
    if ((photoKind !== "ais" && photoKind !== "adsb") || !record ||
        (photoKind === "ais" && (record.isAid || record.isStation))) {
      holder.style.display = "none";
      return;
    }
    holder.style.display = "flex";
    var isShip = photoKind === "ais";
    var key = isShip ?
      [record.imo || "", record.mmsi || "", shipPhotoName(record), record.kindName || "generic"].join("|") :
      [record.icao || record.id || "", aircraftRegistration(record), aircraftTypeName(record), adsbModelAssetKey(record) || "generic"].join("|");
    if (holder.__photoKey === key) return;
    holder.__photoKey = key;
    holder.textContent = "";
    var loading = document.createElement("div");
    loading.className = "dnx-am-info-photo-state";
    loading.textContent = isShip ? "Suche Schiffsbild …" : "Suche Flugzeugbild …";
    holder.appendChild(loading);
    var photoPromise = isShip ? getShipPhoto(record) : getAircraftPhoto(record);
    photoPromise.then(function (photo) {
      if (!holder.isConnected || holder.__photoKey !== key) return;
      holder.textContent = "";
      if (!photo) {
        loading.textContent = isShip ?
          "Kein passendes Schiffsbild gefunden (Wikimedia Commons)." :
          "Kein eindeutig passendes Foto dieses Flugzeugs verfügbar. Fotos bei den externen Anbietern öffnen oder erneut laden.";
        holder.appendChild(loading);
        return;
      }
      var img = document.createElement("img");
      img.className = "dnx-am-info-photo-image";
      img.alt = photo.match === "exact" ?
                "Foto von " + (isShip ? (record.name || photo.title) : (record.flight || aircraftTypeName(record) || photo.title)) :
                (isShip ? "Typbild: " + (AIS_CLASS_LABELS[record.kindName] || "Schiff") + " (nicht dieses Einzelschiff)" :
                          "Typbild: " + (aircraftTypeName(record) || "Flugzeug") + " (nicht dieses Einzelflugzeug)");
      img.loading = "eager";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = photo.src;
      img.onerror = function () {
        if (holder.__photoKey !== key) return;
        holder.textContent = "";
        var fail = document.createElement("div");
        fail.className = "dnx-am-info-photo-state";
        fail.textContent = "Das Commons-Bild konnte nicht geladen werden.";
        holder.appendChild(fail);
      };
      var photoLink = document.createElement("a");
      photoLink.href = photo.pageUrl; photoLink.target = "_blank"; photoLink.rel = "noopener noreferrer";
      photoLink.appendChild(img); holder.appendChild(photoLink);
      var caption = document.createElement("div");
      caption.className = "dnx-am-info-photo-caption";
      caption.textContent = (photo.match === "exact" ?
          (isShip ? "Schiffsfoto" : "Foto · " + (aircraftRegistration(record) || record.icao || record.id)) :
          (isShip ? "Typbild · nicht dieses Einzelschiff" : "Typbild · nicht dieses Einzelflugzeug")) +
        " · " + (photo.artist || "Wikimedia Commons") + " · " + photo.license;
      var source = document.createElement("a");
      source.href = photo.pageUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Quelle: " + photo.title;
      caption.appendChild(document.createTextNode(" · "));
      caption.appendChild(source);
      holder.appendChild(caption);
    });
  }

  function infoPages(kind, record) {
    var position = formatCoordinate(record.lat) + ", " + formatCoordinate(record.lon);
    var points = record.track ? record.track.length : 0;
    if (kind === "ais") {
      var modelKind = record.kindName || aisModelKind(record);
      var className = AIS_CLASS_LABELS[modelKind] || AIS_CLASS_LABELS.generic;
      var eta = record.eta ? String(record.eta.day).padStart(2, "0") + "." + String(record.eta.month).padStart(2, "0") + " " + String(record.eta.hour).padStart(2, "0") + ":" + String(record.eta.minute).padStart(2, "0") + " UTC" : "—";
      return [
        { title: "Identität", fields: [
          ["Schiffsname", record.name || "—"], ["MMSI", record.mmsi || "—"],
          ["AIS-Meldungstyp", displayValue(record.aisType)], ["AIS-Schiffstyp", displayValue(record.shipType)],
          ["3D-Modellklasse", className],
          ["Rufzeichen", record.callsign || "—"], ["IMO", record.imo || "—"]
        ]},
        { title: "Schiffsdaten", fields: [
          ["Länge", displayValue(record.lengthM, " m")], ["Breite", displayValue(record.beamM, " m")],
          ["Tiefgang", displayValue(record.draughtM, " m")], ["Ziel", record.destination || "—"],
          ["ETA", eta], ["Navigationsstatus", navStatusText(record.navStatus)]
        ]},
        { title: "Position & Fahrt", fields: [
          ["Position", position], ["Geschwindigkeit", displayValue(record.sogKn, " kn")],
          ["Kurs über Grund", displayValue(record.cogDeg, "°")], ["Heading", displayValue(record.headingDeg, "°")],
          ["Letzte Position", formatSeen(record.lastPositionAt)], ["Zuletzt empfangen", formatSeen(record.lastSeen)]
        ]},
        { title: "Empfang & Spur", fields: [
          ["Meldungen", displayValue(record.reports)], ["Spurpunkte", displayValue(points)],
          ["Spurstatus", points >= 2 ? "bereit zum Abspielen" : "sammelt; mindestens 2 Positionen nötig"],
          ["Quelle", record.source || "aktives OpenWebRX-Profil"], ["Frequenz", record.freq || "—"]
        ]}
      ];
    }
    return [
      { title: "Identität", fields: [
        ["Rufzeichen", record.flight || "—"], ["ICAO", record.icao || record.id || "—"],
        ["Registrierung", aircraftRegistration(record) || "—"], ["Flugzeugtyp (Metadaten)", record.aircraft || record.modelType || "—"], ["Kategorie", record.category || "—"],
        ["Modellauswahl", aircraftModelNotice(record)],
        ["Lokaler Typabgleich", record.modelTypeStatus || "wartet / keine sichere Zuordnung"],
        ["Squawk", record.squawk || "—"], ["Notfallstatus", record.emergency || "—"]
      ]},
      { title: "Position & Flug", fields: [
        ["Position", position], ["Barometrische Höhe", displayValue(record.altitudeFt, " ft")],
        ["Geometrische Höhe", displayValue(record.geomAltitudeFt, " ft")],
        ["NAV-Höhe", displayValue(record.navAltitudeFt, " ft")],
        ["Geschwindigkeit", displayValue(record.speedKn, " kn")], ["Kurs", displayValue(record.courseDeg, "°")],
        ["Vertikal-/Barorate", displayValue(record.vspeedFpm, " ft/min")]
      ]},
      { title: "Empfang & Spur", fields: [
        ["Letzte Position", formatSeen(record.lastPositionAt)], ["Zuletzt empfangen", formatSeen(record.lastSeen)],
        ["Positionsalter", record.lastPositionAt ? Math.max(0,Math.floor((now()-record.lastPositionAt)/1000)) + " s" : "unbekannt"],
        ["Meldungen", displayValue(record.reports)], ["Empfangene ADS-B-Pakete", displayValue(record.messageCount)],
        ["Signalstärke", displayValue(record.rssi, " dBFS")], ["Meldungsalter", displayValue(record.seenSec, " s")],
        ["Positionsalter", displayValue(record.seenPosSec, " s")], ["Quelle", record.source || "aktives OpenWebRX-Profil"],
        ["Frequenz", record.freq || "—"], ["Spurpunkte", displayValue(points)],
        ["Spurstatus", points >= 2 ? "bereit zum Abspielen" : "sammelt; mindestens 2 Positionen nötig"]
      ]}
    ];
  }

  function renderInfoPage(rec) {
    if (!rec || !rec.infoPanel) return;
    var kind = rec.infoKind, id = rec.infoId, record = (RECORDS[kind] || {})[id];
    if (!record) { closeInfoPanel(rec); return; }
    var pages = infoPages(kind, record);
    rec.infoIndex = (rec.infoIndex + pages.length) % pages.length;
    var page = pages[rec.infoIndex];
    var title = q(".dnx-am-info-title", rec.infoPanel);
    var content = q(".dnx-am-info-content", rec.infoPanel);
    var pageCounter = q(".dnx-am-info-page", rec.infoPanel);
    if (title) title.textContent = recordLabel(kind, record);
    if (pageCounter) pageCounter.textContent = (rec.infoIndex + 1) + "/" + pages.length;
    if (!content) return;
    while (content.firstChild) content.removeChild(content.firstChild);
    var heading = document.createElement("h4");
    heading.textContent = page.title;
    content.appendChild(heading);
    page.fields.forEach(function (field) {
      var row = document.createElement("div");
      row.className = "dnx-am-info-row";
      var key = document.createElement("span"), value = document.createElement("span");
      key.textContent = field[0];
      value.textContent = displayValue(field[1]);
      row.appendChild(key);
      row.appendChild(value);
      content.appendChild(row);
    });
    var links = q(".dnx-am-info-links", rec.infoPanel);
    if (links) {
      links.style.display = kind === "adsb" ? "block" : "none";
      var linksKey = kind + "|" + (record.icao || record.id) + "|" + aircraftRegistration(record) + "|" + record.flight;
      if (links.__key !== linksKey && kind === "adsb") {
        links.textContent = "Externe Anbieter · neuer Tab (eigene Datenschutzregeln): ";
        appendAircraftLinks(links, record);
        var notice = document.createElement("a");
        notice.href = APP_ROOT + "/models/adsb-realistic/bluebell-neutral/NOTICE.html";
        notice.target = "_blank"; notice.rel = "noopener noreferrer";
        notice.textContent = "Modellherkunft & Lizenzen"; links.appendChild(notice);
        links.__key = linksKey;
      }
    }
    renderShipPhoto(rec, record);
  }

  function closeInfoPanel(rec) {
    if (!rec) return;
    if (rec.infoTimer) { window.clearInterval(rec.infoTimer); rec.infoTimer = null; }
    if (rec.infoPanel && rec.infoPanel.parentNode) rec.infoPanel.parentNode.removeChild(rec.infoPanel);
    rec.infoPanel = null;
  }

  function openInfoSlideshow(rec, kind, id, autoplay) {
    if (!rec || !rec.win) return;
    closeInfoPanel(rec);
    var panel = document.createElement("div");
    panel.className = "dnx-am-info-panel";
    panel.setAttribute("data-pane", "camera");
    panel.innerHTML = '<div class="dnx-am-info-head"><button type="button" data-info-action="camera" aria-label="Kameraverfolgung" aria-pressed="false" title="Kamera folgt diesem Ziel"><svg width="17" height="14" viewBox="0 0 24 18" aria-hidden="true"><path fill="currentColor" d="M2 3h13v12H2zM16 6l6-4v14l-6-4z"/><path class="dnx-camera-stop" stroke="currentColor" stroke-width="2" d="M2 17L22 1"/></svg></button><span class="dnx-am-info-title"></span><button type="button" data-info-action="play" aria-label="Kameraverfolgung starten" title="Play · Kamera folgt dem Ziel">▶ Play</button><button type="button" data-info-action="stop-camera" title="Kameraverfolgung beenden">■ Stop</button><button type="button" data-info-action="collapse" title="Zielsteuerung einklappen" aria-expanded="true">−</button><button type="button" data-info-action="close" title="Schließen">×</button></div><div class="dnx-am-target-tabs"><button type="button" data-info-action="tab-camera">Kamera</button><button type="button" data-info-action="tab-options">Optionen</button><button type="button" data-info-action="tab-info">Infos</button><button type="button" data-info-action="tab-photo">Foto</button></div><div class="dnx-am-target-controls"></div><div class="dnx-am-info-content"></div><div class="dnx-am-info-nav"><button type="button" data-info-action="prev">‹ Zurück</button><span class="dnx-am-info-page"></span><button type="button" data-info-action="next">Weiter ›</button></div><div class="dnx-am-info-links"></div><button type="button" data-info-action="photo-refresh">Foto erneut laden</button><div class="dnx-am-info-photo" aria-live="polite"></div>';
    rec.infoPanel = panel;
    rec.infoKind = kind;
    rec.infoId = id;
    rec.infoIndex = 0;
    rec.win.appendChild(panel);
    buildTargetControls(rec, kind, String(id));
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Zielsteuerung · " + kind.toUpperCase() + " · " + id);
    panel.addEventListener("pointerdown", function (event) { event.stopPropagation(); }, true);
    panel.addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest("[data-info-action]");
      if (!button) return;
      var action = button.getAttribute("data-info-action");
      if (action.indexOf("tab-") === 0) panel.setAttribute("data-pane", action.slice(4));
      if (action === "collapse") {
        var collapsed = panel.getAttribute("data-collapsed") !== "true";
        panel.setAttribute("data-collapsed", collapsed ? "true" : "false");
        button.setAttribute("aria-expanded", collapsed ? "false" : "true");
        button.textContent = collapsed ? "+" : "−";
        button.title = collapsed ? "Zielsteuerung ausklappen" : "Zielsteuerung einklappen";
      }
      if (action === "camera") toggleSelectedCamera(rec);
      if (action === "play") {
        if (!rec.follow || rec.follow.id !== String(id) || followTargetKind(rec) !== kind) startFollowTarget(rec, String(id));
      }
      if (action === "stop-camera") stopFollow(rec, false);
      if (action === "zoom") zoomToRecord(rec, kind, String(id));
      if (action === "offset-reset") { ensureTargetFollow(rec, kind, String(id)); setFollowModelOffset(rec, 0); }
      if (action === "orbit") { ensureTargetFollow(rec, kind, String(id)); toggleAutoOrbit(rec); }
      if (action === "replay") playTrack(rec, kind, String(id));
      if (action === "stop-replay") stopTrackReplay(rec);
      if (action === "photo-refresh") {
        var holder = q(".dnx-am-info-photo", panel);
        if (holder) holder.__photoKey = null;
        if (kind === "adsb") AIRCRAFT_PHOTO_CACHE = Object.create(null);
        renderInfoPage(rec);
      }
      if (action === "close") { closeInfoPanel(rec); selectTrafficTarget(rec, null, null); }
      if (action === "prev") { rec.infoIndex--; renderInfoPage(rec); }
      if (action === "next") { rec.infoIndex++; renderInfoPage(rec); }
    });
    renderInfoPage(rec);
    updateNativeCameraButton(rec);
    // Historical autoplay argument never starts camera or slideshow.

  }

  function stopTrackReplay(rec) {
    if (!rec) return;
    if (rec.replayTimer) { window.clearInterval(rec.replayTimer); rec.replayTimer = null; }
    if (rec.replayMarker && rec.map2d) { try { rec.map2d.removeLayer(rec.replayMarker); } catch (e) {} }
    rec.replayMarker = null;
    if (rec.replayEntity && rec.viewer) { try { rec.viewer.entities.remove(rec.replayEntity); } catch (e2) {} }
    rec.replayEntity = null;
    rec.replay = null;
  }

  function playTrack(rec, kind, id) {
    var record = (RECORDS[kind] || {})[id];
    var points = record && record.track ? record.track.slice() : [];
    if (points.length < 2) {
      showToast(rec, "Noch keine sichtbare Spur: erforderlich sind mindestens zwei unterschiedliche Positionsmeldungen.");
      return;
    }
    stopTrackReplay(rec);
    rec.replay = { kind: kind, id: id, points: points, index: 0 };
    if (rec.map2d && window.L) {
      rec.replayMarker = window.L.circleMarker([points[0].lat, points[0].lon], {
        radius: 8, color: "#111", weight: 2, fillColor: "#fff200", fillOpacity: 1, pane: "markerPane"
      }).addTo(rec.map2d);
      rec.replayMarker.bindTooltip("Spurwiedergabe", { permanent: true, direction: "top" });
    }
    if (rec.viewer && window.Cesium) {
      var C = window.Cesium;
      rec.replayEntity = rec.viewer.entities.add({
        id: "dnx-replay-" + kind + "-" + id,
        position: C.Cartesian3.fromDegrees(points[0].lon, points[0].lat, kind === "adsb" ? (points[0].altitude || 0) : 8),
        point: { pixelSize: 13, color: C.Color.YELLOW, outlineColor: C.Color.BLACK, outlineWidth: 2 },
        label: { text: "Spurwiedergabe", font: "11px Segoe UI,Arial,sans-serif", pixelOffset: new C.Cartesian2(0, -17), fillColor: C.Color.YELLOW, outlineColor: C.Color.BLACK, outlineWidth: 3 }
      });
    }
    var index = 0;
    rec.replayTimer = window.setInterval(function () {
      if (!rec.replay || index >= points.length) {
        stopTrackReplay(rec);
        showToast(rec, "Spurwiedergabe beendet.");
        return;
      }
      var point = points[index++];
      if (rec.replayMarker) rec.replayMarker.setLatLng([point.lat, point.lon]);
      if (rec.replayEntity && rec.viewer && window.Cesium) {
        rec.replayEntity.position = window.Cesium.Cartesian3.fromDegrees(point.lon, point.lat, kind === "adsb" ? (point.altitude || 0) : 8);
      }
      if (rec.viewer) { try { rec.viewer.scene.requestRender(); } catch (e) {} }
    }, 700);
    showToast(rec, "Spurwiedergabe gestartet · " + points.length + " Positionen");
  }

  /* ---------- Compact DNX window manager ---------- */

  function viewport() {
    return {
      w: Math.max(240, window.innerWidth || document.documentElement.clientWidth || 1024),
      h: Math.max(220, window.innerHeight || document.documentElement.clientHeight || 768)
    };
  }

  function minSize() {
    var v = viewport();
    return {
      w: Math.min(360, Math.max(230, v.w - 12)),
      h: Math.min(260, Math.max(190, v.h - 12))
    };
  }

  function defaultRect(key) {
    var v = viewport();
    var w = Math.min(650, Math.max(230, v.w - 24));
    var h = Math.min(450, Math.max(190, v.h - 60));
    var dx = key === "ais" ? 18 : -18;
    return {
      left: clamp(Math.round((v.w - w) / 2 + dx), 0, Math.max(0, v.w - w)),
      top: clamp(Math.round((v.h - h) / 2 + dx), 0, Math.max(0, v.h - h)),
      width: w, height: h
    };
  }

  function rectKey(key) { return "dnx.airmarine." + key + ".window.v2"; }

  function loadRect(key) {
    var r = defaultRect(key), v = viewport(), m = minSize();
    try {
      var saved = JSON.parse(localStorage.getItem(rectKey(key)) || "null");
      if (saved && isFinite(+saved.left) && isFinite(+saved.top) &&
          isFinite(+saved.width) && isFinite(+saved.height)) {
        r = { left: +saved.left, top: +saved.top, width: +saved.width, height: +saved.height };
      }
    } catch (e) {}
    r.width = clamp(r.width, m.w, Math.max(m.w, v.w - 12));
    r.height = clamp(r.height, m.h, Math.max(m.h, v.h - 12));
    r.left = clamp(r.left, 0, Math.max(0, v.w - r.width));
    r.top = clamp(r.top, 0, Math.max(0, v.h - Math.min(r.height, 46)));
    return r;
  }

  function setRect(win, r) {
    var v = viewport(), m = minSize();
    var w = clamp(Math.round(r.width), m.w, Math.max(m.w, v.w - 12));
    var h = clamp(Math.round(r.height), m.h, Math.max(m.h, v.h - 12));
    var l = clamp(Math.round(r.left), 0, Math.max(0, v.w - w));
    var t = clamp(Math.round(r.top), 0, Math.max(0, v.h - Math.min(h, 46)));
    win.style.left = l + "px";
    win.style.top = t + "px";
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.style.minWidth = m.w + "px";
    win.style.minHeight = m.h + "px";
  }

  function saveRect(rec) {
    if (!rec || !rec.win || rec.maximized) return;
    try {
      var r = rec.win.getBoundingClientRect();
      localStorage.setItem(rectKey(rec.spec.key), JSON.stringify({
        left: Math.round(r.left), top: Math.round(r.top),
        width: Math.round(r.width), height: Math.round(r.height)
      }));
    } catch (e) {}
  }

  function installStyle() {
    if (byId("dnx-airmarine-3d-style")) return;
    var style = document.createElement("style");
    style.id = "dnx-airmarine-3d-style";
    style.textContent = `
      .dnx-am-window{box-sizing:border-box;position:fixed;display:flex;flex-direction:column;overflow:hidden;min-width:230px;min-height:190px;background:#0b1219;border:1px solid #38c979;border-radius:8px;box-shadow:0 14px 42px rgba(0,0,0,.62);color:#e6edf3;font:12px/1.3 Segoe UI,Arial,sans-serif;}
      .dnx-am-window.dnx-am-active{border-color:#86efac;box-shadow:0 16px 46px rgba(0,0,0,.68),0 0 0 1px rgba(56,201,121,.35);}
      .dnx-am-head{box-sizing:border-box;display:flex;align-items:center;gap:7px;flex:0 0 36px;min-width:0;height:36px;padding:0 7px 0 10px;background:linear-gradient(180deg,#17251d,#101a14);border-bottom:1px solid rgba(56,201,121,.55);border-radius:7px 7px 0 0;cursor:move;touch-action:none;user-select:none;}
      .dnx-am-title{flex:1 1 auto;min-width:0;overflow:hidden;color:#d0f6dc;font-size:12px;font-weight:700;white-space:nowrap;text-overflow:ellipsis;}
      .dnx-am-source{flex:0 1 auto;max-width:34%;overflow:hidden;color:#93a79a;font:10px ui-monospace,monospace;white-space:nowrap;text-overflow:ellipsis;}
      .dnx-am-controls{display:flex;flex:0 0 auto;align-items:center;gap:4px;}
      .dnx-am-controls button{box-sizing:border-box;width:25px;height:23px;padding:0;border:1px solid #43514a;border-radius:5px;background:#202a24;color:#e6edf3;font:700 13px/1 Arial,sans-serif;cursor:pointer;}
      .dnx-am-controls button:hover,.dnx-am-toolbar button:hover{background:#2c4234;border-color:#69db98;}
      .dnx-am-controls button.dnx-am-close{background:#6e2727;border-color:#9d3b3b;color:#fff;}
      .dnx-am-controls button.dnx-am-close:hover{background:#a93232;}
      .dnx-am-modes{display:flex;flex:0 0 auto;align-items:center;gap:3px;}
      .dnx-am-modes button{height:23px;padding:0 7px;border:1px solid #43514a;border-radius:5px;background:#202a24;color:#c9d6cf;font:700 9px Segoe UI,Arial,sans-serif;white-space:nowrap;cursor:pointer;}
      .dnx-am-modes button.on{background:#146c43;color:#fff;border-color:#86efac;}
      .dnx-am-toolbar{box-sizing:border-box;display:flex;align-items:center;gap:6px;flex:0 0 31px;min-width:0;height:31px;padding:3px 7px;background:#111922;border-bottom:1px solid #26342c;overflow:hidden;}
      .dnx-am-toolbar button,.dnx-am-toolbar select{box-sizing:border-box;height:23px;padding:0 7px;border:1px solid #43514a;border-radius:5px;background:#202a24;color:#e6edf3;font:10px Segoe UI,Arial,sans-serif;white-space:nowrap;cursor:pointer;}
      .dnx-am-toolbar label{display:flex;align-items:center;gap:3px;color:#c5d0c8;font-size:10px;white-space:nowrap;}
      .dnx-am-toolbar input{width:13px;height:13px;margin:0;accent-color:#38c979;}
      .dnx-am-status{flex:1 1 auto;min-width:0;overflow:hidden;color:#9fd6b6;font:10px ui-monospace,monospace;text-align:right;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-body{box-sizing:border-box;position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2px;flex:1 1 auto;min-width:0;min-height:0;overflow:hidden;background:#263a31;}
      .dnx-am-body[data-mode="2d"],.dnx-am-body[data-mode="3d"]{grid-template-columns:minmax(0,1fr);}
      .dnx-am-traffic-label{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;pointer-events:none!important;}
      .dnx-am-traffic-label:before{display:none!important;}
      .dnx-am-pane{box-sizing:border-box;position:relative;min-width:0;min-height:0;overflow:hidden;background:#06131d;}
      .dnx-am-pane.hidden{display:none;}
      .dnx-am-map2d,.dnx-am-view{position:absolute;z-index:0;inset:0;min-width:0;min-height:0;background:#06131d;}
      .dnx-am-model-credit{position:absolute;z-index:9;left:6px;bottom:6px;max-width:calc(100% - 12px);overflow:hidden;padding:3px 6px;border:1px solid rgba(134,239,172,.45);border-radius:5px;background:rgba(5,14,20,.86);color:#b8d3c1;font:9px/1.25 Segoe UI,Arial,sans-serif;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-model-credit a{color:#9ff1b8;text-decoration:none;}
      .dnx-am-model-credit a:hover{text-decoration:underline;}
      .dnx-am-follow-hud{box-sizing:border-box;position:absolute;z-index:10;top:6px;right:6px;width:min(340px,calc(100% - 12px));display:flex;flex-direction:column;gap:4px;padding:6px;border:1px solid rgba(134,239,172,.72);border-radius:7px;background:rgba(5,14,20,.91);color:#eef7f0;box-shadow:0 5px 18px rgba(0,0,0,.45);font:10px/1.25 Segoe UI,Arial,sans-serif;pointer-events:auto;}
      .dnx-am-follow-hud[hidden]{display:none;}
      .dnx-am-follow-head,.dnx-am-follow-row{display:flex;align-items:center;gap:5px;min-width:0;}
      .dnx-am-follow-title{flex:1 1 auto;min-width:0;overflow:hidden;color:#c9f7d8;font-weight:700;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-follow-course{flex:0 0 auto;color:#c7d8cc;font:9px ui-monospace,monospace;white-space:nowrap;}
      .dnx-am-follow-hud button,.dnx-am-follow-hud select{box-sizing:border-box;min-width:0;height:22px;padding:0 5px;border:1px solid #496250;border-radius:5px;background:#18251d;color:#eef7f0;font:9px Segoe UI,Arial,sans-serif;white-space:nowrap;}
      .dnx-am-follow-hud button{cursor:pointer;}
      .dnx-am-follow-hud button:hover,.dnx-am-follow-hud select:hover{border-color:#86efac;background:#244531;}
      .dnx-am-follow-preset{flex:1 1 auto;}
      .dnx-am-follow-slider-label{display:flex;flex:1 1 auto;align-items:center;gap:4px;min-width:0;color:#bfd1c4;font-size:9px;white-space:nowrap;}
      .dnx-am-follow-slider-label input{width:76px;max-width:35%;height:14px;margin:0;accent-color:#38c979;}
      .dnx-am-follow-offset-value{min-width:32px;color:#eaffef;font:9px ui-monospace,monospace;text-align:right;}
      .dnx-am-follow-note{overflow:hidden;color:#a9c6b1;font-size:8px;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-follow-hud .dnx-am-follow-stop{border-color:#9d3b3b;background:#562121;color:#fff;}
      .dnx-am-wait{position:absolute;z-index:2000;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(460px,82%);padding:10px 14px;border:1px solid rgba(80,150,120,.55);border-radius:8px;background:rgba(5,14,20,.82);color:#d6e6dc;font:12px/1.5 Segoe UI,Arial,sans-serif;text-align:center;pointer-events:none;}
      .dnx-am-leaflet-icon{background:transparent!important;border:0!important;}
      .dnx-am-leaf-marker{display:grid;place-items:center;width:30px;height:30px;filter:drop-shadow(0 1px 2px #000);transform-origin:center;}
      .dnx-am-leaf-marker svg{display:block;overflow:visible;}
      .dnx-am-context-menu{position:fixed;z-index:2147483600;box-sizing:border-box;width:235px;max-width:calc(100vw - 12px);padding:7px;border:1px solid #48d887;border-radius:9px;background:#0b1512;color:#e7f2ea;box-shadow:0 12px 36px rgba(0,0,0,.78);font:12px Segoe UI,Arial,sans-serif;}
      .dnx-am-context-menu strong{display:block;padding:4px 6px 7px;overflow:hidden;color:#c9f7d8;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-context-menu button{display:block;width:100%;min-width:0;height:30px;margin:3px 0;padding:0 8px;border:1px solid #34483c;border-radius:6px;background:#18251d;color:#e6edf3;font:700 11px Segoe UI,Arial,sans-serif;text-align:left;cursor:pointer;}
      .dnx-am-context-menu button:hover:not(:disabled){background:#244531;border-color:#67d18f;}
      .dnx-am-context-menu button:disabled{opacity:.48;cursor:not-allowed;}
      .dnx-am-info-panel{box-sizing:border-box;position:absolute;z-index:24;right:8px;top:42px;width:min(278px,calc(100% - 16px));max-height:min(330px,calc(100% - 55px));display:flex;flex-direction:column;overflow:auto;border:1px solid #5ddc91;border-radius:9px;background:rgba(7,17,14,.96);color:#e6edf3;box-shadow:0 12px 34px rgba(0,0,0,.75);font:11px/1.35 Segoe UI,Arial,sans-serif;}
      .dnx-camera-stop{display:none;}
      [data-info-action="camera"].tracking .dnx-camera-stop{display:block;}
      [data-info-action="camera"].tracking{background:#52616d;}
      .dnx-am-info-panel>*{flex-shrink:0;}
      .dnx-am-info-head{position:sticky;top:0;z-index:2;}
      .dnx-am-target-tabs{display:flex;gap:3px;padding:4px 6px;border-bottom:1px solid #496250;background:#10241d;}
      .dnx-am-target-tabs button{flex:1;background:#21343c;color:#edf4f8;border:1px solid #647783;border-radius:4px;padding:3px 2px;font:11px Segoe UI,Arial,sans-serif;cursor:pointer;}
      .dnx-am-info-panel[data-pane=camera] [data-info-action=tab-camera],.dnx-am-info-panel[data-pane=options] [data-info-action=tab-options],.dnx-am-info-panel[data-pane=info] [data-info-action=tab-info],.dnx-am-info-panel[data-pane=photo] [data-info-action=tab-photo]{background:#4c646e;border-color:#d5e7ed;}
      .dnx-am-info-panel:not([data-pane=info]) .dnx-am-info-content,.dnx-am-info-panel:not([data-pane=info]) .dnx-am-info-nav,.dnx-am-info-panel:not([data-pane=info]) .dnx-am-info-links{display:none;}
      .dnx-am-info-panel:not([data-pane=photo]) .dnx-am-info-photo,.dnx-am-info-panel:not([data-pane=photo]) [data-info-action=photo-refresh]{display:none;}
      .dnx-am-info-panel[data-pane=photo] .dnx-am-target-controls{display:none;}
      .dnx-am-info-panel[data-pane=camera] .dnx-am-target-controls label:not([data-target-control="Kamera-Abstand"]):not([data-target-control="Kameraansicht"]),.dnx-am-info-panel[data-pane=camera] .dnx-am-target-actions,.dnx-am-info-panel[data-pane=camera] .dnx-am-target-controls small:not([data-target-status]){display:none;}
      .dnx-am-info-panel[data-pane=options] [data-target-control="Info-Bereich"]{display:none;}
      .dnx-am-info-panel[data-pane=info] .dnx-am-target-controls label:not([data-target-control="Info-Bereich"]),.dnx-am-info-panel[data-pane=info] .dnx-am-target-actions,.dnx-am-info-panel[data-pane=info] .dnx-am-target-controls small{display:none;}
      .dnx-am-info-panel[data-collapsed=true]>:not(.dnx-am-info-head){display:none!important;}
      .dnx-am-target-controls{padding:7px;display:grid;gap:6px;border-bottom:1px solid #496250;}
      .dnx-am-target-controls label{display:flex;align-items:center;justify-content:space-between;gap:6px;}
      .dnx-am-target-controls select{max-width:130px;background:#17252c;color:#edf4f8;border:1px solid #647783;border-radius:4px;padding:3px;}
      .dnx-am-target-controls input[type=range]{width:125px;min-width:60px;}
      .dnx-am-target-controls small{color:#bbcbd2;}
      .dnx-am-target-actions{display:flex;flex-wrap:wrap;gap:4px;}
      .dnx-am-target-actions button{background:#21343c;color:#edf4f8;border:1px solid #647783;border-radius:4px;padding:4px 6px;cursor:pointer;}
      .dnx-am-info-head button:disabled{opacity:.55;cursor:default;}
      .dnx-am-info-head{display:flex;align-items:center;gap:5px;padding:6px 7px;background:#143322;border-bottom:1px solid #31513b;}
      .dnx-am-info-title{flex:1;min-width:0;overflow:hidden;color:#d8ffe4;font-weight:700;text-overflow:ellipsis;white-space:nowrap;}
      .dnx-am-info-head button,.dnx-am-info-nav button{border:1px solid #496250;border-radius:5px;background:#20352a;color:#fff;cursor:pointer;}
      .dnx-am-info-head button{height:22px;padding:0 6px;font:700 10px Arial,sans-serif;}
      .dnx-am-info-content{flex:0 0 auto;min-height:0;overflow:visible;padding:7px;}
      .dnx-am-info-content h4{margin:0 0 5px;color:#9ff1b8;font-size:11px;}
      .dnx-am-info-row{display:grid;grid-template-columns:minmax(86px,.8fr) minmax(0,1.2fr);gap:8px;padding:3px 0;border-bottom:1px solid rgba(180,210,190,.12);}
      .dnx-am-info-row span:first-child{color:#9eafa5;}
      .dnx-am-info-row span:last-child{overflow-wrap:anywhere;color:#eef7f0;}
      .dnx-am-info-nav{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:5px 7px;border-top:1px solid #31513b;}
      .dnx-am-info-nav button{height:23px;padding:0 8px;font:700 10px Segoe UI,Arial,sans-serif;}
      .dnx-am-info-page{color:#a8c8b1;font:10px ui-monospace,monospace;}
      .dnx-am-info-photo{box-sizing:border-box;display:flex;flex:0 0 auto;flex-direction:column;gap:4px;max-height:none;overflow:visible;padding:6px 7px 7px;border-top:1px solid #31513b;background:rgba(4,11,8,.76);}
      .dnx-am-info-photo-image{display:block;width:100%;height:160px;object-fit:contain;object-position:center;border-radius:5px;background:#0b1712;}
      .dnx-am-info-photo-caption{min-width:0;overflow:hidden;color:#a8b9ad;font:9px/1.3 Segoe UI,Arial,sans-serif;text-overflow:ellipsis;white-space:normal;}
      .dnx-am-info-photo-caption a{color:#9de7b4;text-decoration:underline;}
      .dnx-am-info-photo-state{min-height:28px;display:grid;place-items:center;color:#b8c9be;font:10px/1.4 Segoe UI,Arial,sans-serif;text-align:center;}
      .dnx-am-toast{position:absolute;z-index:26;left:50%;bottom:28px;transform:translateX(-50%);max-width:90%;padding:7px 10px;border:1px solid #71dc9b;border-radius:7px;background:rgba(6,16,12,.94);color:#edfff2;font:11px Segoe UI,Arial,sans-serif;text-align:center;pointer-events:none;}
      .dnx-am-footer{box-sizing:border-box;flex:0 0 21px;height:21px;overflow:hidden;padding:3px 8px;background:#0c141b;border-top:1px solid #203026;color:#91a398;font:9px ui-monospace,monospace;white-space:nowrap;text-overflow:ellipsis;}
      .dnx-am-grip{position:absolute;z-index:8;display:none;pointer-events:none;touch-action:none;user-select:none;background:transparent;}
      .dnx-am-window.dnx-am-active .dnx-am-grip{display:block;pointer-events:auto;background:rgba(56,201,121,.08);}
      .dnx-am-window.dnx-am-active .dnx-am-grip-ne,.dnx-am-window.dnx-am-active .dnx-am-grip-nw,.dnx-am-window.dnx-am-active .dnx-am-grip-se,.dnx-am-window.dnx-am-active .dnx-am-grip-sw{background:rgba(56,201,121,.2);}
      .dnx-am-controls{position:relative;z-index:12;}
      .dnx-am-grip-n{left:12px;right:12px;top:0;height:8px;cursor:ns-resize;}
      .dnx-am-grip-s{left:12px;right:12px;bottom:0;height:8px;cursor:ns-resize;}
      .dnx-am-grip-e{right:0;top:12px;bottom:12px;width:8px;cursor:ew-resize;}
      .dnx-am-grip-w{left:0;top:12px;bottom:12px;width:8px;cursor:ew-resize;}
      .dnx-am-grip-ne{right:0;top:0;width:12px;height:12px;cursor:nesw-resize;}
      .dnx-am-grip-nw{left:0;top:0;width:12px;height:12px;cursor:nwse-resize;}
      .dnx-am-grip-se{right:0;bottom:0;width:14px;height:14px;cursor:nwse-resize;}
      .dnx-am-grip-sw{left:0;bottom:0;width:14px;height:14px;cursor:nesw-resize;}
      @media(max-width:520px){.dnx-am-source{display:none}.dnx-am-toolbar{gap:4px}.dnx-am-toolbar button,.dnx-am-toolbar select{padding:0 5px}.dnx-am-toolbar [data-am-action="home"]{display:none}.dnx-am-toolbar select{max-width:116px}.dnx-am-status{display:none}.dnx-am-body[data-mode="both"]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) minmax(0,1fr)}.dnx-am-footer{font-size:8px}}
      @media(max-width:360px){.dnx-am-toolbar{gap:3px}.dnx-am-toolbar [data-am-action="fit"]{display:none}.dnx-am-toolbar select{max-width:96px}.dnx-am-toolbar label{gap:2px;font-size:9px}}
    `;
    document.head.appendChild(style);
  }

  function setStatus(rec, text) {
    if (!rec || !rec.win) return;
    var status = q("[data-am-status]", rec.win);
    if (status) status.textContent = text;
  }

  function setError(rec, text) {
    if (!rec || !rec.win) return;
    var wait = q(".dnx-am-3d-wait", rec.win);
    if (wait) {
      wait.style.display = "block";
      wait.textContent = text;
    }
    setStatus(rec, "3D nicht verfügbar");
  }

  function updateWindowStatus(kind) {
    var rec = WINDOWS[kind];
    if (!rec || !rec.win) return;
    var data = getRecords(kind);
    var total = Object.keys(RECORDS[kind] || {}).length;
    var trailCount = data.filter(function (record) { return record.track && record.track.length >= 2; }).length;
    var label = data.length + " mit Position · " + total + " Ziele · " + trailCount + " Spuren";
    setStatus(rec, label);
    var waits = [q(".dnx-am-3d-wait", rec.win), q(".dnx-am-map-wait", rec.win)];
    waits.forEach(function (wait) {
      if (!wait) return;
      if ((wait.classList.contains("dnx-am-3d-wait") && rec.failed) ||
          (wait.classList.contains("dnx-am-map-wait") && rec.mapFailed)) return;
      if (data.length) {
        wait.style.display = "none";
      } else {
        wait.style.display = "block";
        if (kind === "ais") {
          wait.textContent = total ? "AIS-Meldungen empfangen, aber noch keine gültige Position. Die Spur erscheint nach mindestens zwei unterschiedlichen Positionsmeldungen." : "Warte auf AIS-Positionsmeldungen aus dem aktuell aktiven OpenWebRX-Profil …";
        } else {
          wait.textContent = total ? "ADS-B-Meldungen empfangen, aber noch keine gültige Position (lat/lon)." : "Warte auf ADS-B-Positionsmeldungen aus dem aktuell aktiven OpenWebRX-Profil …";
        }
      }
    });
    syncToolbarButtons();
  }

  function fitCameraHome(rec) {
    if (!rec) return;
    if (rec.follow) stopFollow(rec, false);
    if (rec.map2d) rec.map2d.setView([51.66, 6.97], 7, { animate: true });
    if (rec.viewer) defaultView(rec.viewer);
  }

  function createWindow(key) {
    var spec = SPECS[key];
    if (!spec || !document.body) return null;
    installStyle();
    var existing = WINDOWS[key];
    if (existing && existing.win && existing.win.isConnected) {
      existing.win.style.display = "flex";
      focusWindow(existing);
      ensureMapsForMode(existing);
      resizeViewer(existing);
      scheduleSync(key);
      return existing;
    }

    var win = document.createElement("section");
    win.className = "dnx-am-window";
    win.id = "dnx-airmarine-window-" + key;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", spec.title);
    win.style.zIndex = String(STACK_BASE + (++stack % 500));
    setRect(win, loadRect(key));

    win.innerHTML =
      '<div class="dnx-am-head">' +
        '<span class="dnx-am-title">' + spec.icon + ' ' + spec.title + ' · aktives Profil</span>' +
        '<span class="dnx-am-modes" aria-label="Kartenansicht">' +
          '<button type="button" data-am-mode="2d" title="Nur 2D-Karte">2D</button>' +
          '<button type="button" data-am-mode="3d" title="Nur 3D-Globus">3D</button>' +
          '<button type="button" data-am-mode="both" title="2D und 3D nebeneinander">BEIDE</button>' +
        '</span>' +
        '<span class="dnx-am-source">' + spec.sourceLabel + '</span>' +
        '<span class="dnx-am-controls">' +
          '<button type="button" data-am-action="fit" title="Alle aktiven Ziele einpassen" aria-label="Alle Ziele">◎</button>' +
          '<button type="button" data-am-action="min" title="Minimieren" aria-label="Minimieren">—</button>' +
          '<button type="button" data-am-action="max" title="Maximieren / wiederherstellen" aria-label="Maximieren">□</button>' +
          '<button type="button" class="dnx-am-close" data-am-action="close" title="Schließen" aria-label="Schließen">×</button>' +
        '</span>' +
      '</div>' +
      '<div class="dnx-am-toolbar">' +
        '<button type="button" data-am-action="fit">Alle Ziele</button>' +
        '<button type="button" data-am-action="home">Start</button>' +
        '<select data-am-option="basemap" aria-label="Karte auswählen" title="Kartenstil auswählen">' +
          Object.keys(BASEMAPS).map(function (bk) {
            return '<option value="' + bk + '">' + BASEMAPS[bk].label + '</option>';
          }).join("") +
        '</select>' +
        '<label><input type="checkbox" data-am-option="tracks" checked> Spuren</label>' +
        '<label><input type="checkbox" data-am-option="labels" checked> Namen</label>' +
        '<button type="button" data-am-action="layers" title="Ebenen &amp; Darstellung">Ebenen</button>' +
        '<span class="dnx-am-status" data-am-status>Initialisiere …</span>' +
      '</div>' +
      layersPanelHtml() +
      '<div class="dnx-am-body" data-mode="both">' +
        '<section class="dnx-am-pane dnx-am-pane-2d">' +
          '<div class="dnx-am-map2d" aria-label="2D-Karte"></div>' +
          '<div class="dnx-am-wait dnx-am-map-wait">Lade lokale Leaflet-Karte …</div>' +
        '</section>' +
        '<section class="dnx-am-pane dnx-am-pane-3d">' +
          '<div class="dnx-am-view" aria-label="Cesium 3D-Globus"></div>' +
          '<div data-am-selection-frame hidden aria-label="Ausgewähltes Flugzeug" style="position:absolute;z-index:9;pointer-events:none;box-sizing:border-box;border:2px solid transparent;border-radius:3px"></div>' +
          '<div class="dnx-am-wait dnx-am-3d-wait">Lade lokale Cesium-3D-Ansicht …</div>' +
          '<div class="dnx-am-model-credit"><a href="' + APP_ROOT + '/models/' + (key === "ais" ? 'ais-realistic/credits.html' : 'adsb-realistic/credits.html') + '" target="_blank" rel="noopener noreferrer" title="Autoren, Quellen und Lizenzen der 3D-' + (key === "ais" ? 'Schiffs' : 'Flugzeug') + 'modelle">3D-Modelle · Quellen &amp; Lizenzen</a></div>' +
          '<div class="dnx-am-follow-hud" data-am-follow-hud hidden>' +
            '<div class="dnx-am-follow-head"><span class="dnx-am-follow-title" data-am-follow-title>3D-Folgeansicht</span><span class="dnx-am-follow-course" data-am-follow-course></span></div>' +
            '<div class="dnx-am-follow-telemetry" data-am-follow-telemetry style="font:11px/1.5 \'Segoe UI\',Arial,sans-serif;color:#9fdcff;margin:0 0 4px"></div>' +
            '<div class="dnx-am-follow-row">' +
              '<select class="dnx-am-follow-preset" data-am-follow-preset aria-label="Kamerawinkel um das Ziel">' +
                '<option value="behind">Hinter dem Ziel</option><option value="side">Seitenansicht</option><option value="front">Vor dem Ziel</option><option value="above">Von oben</option><option value="custom">Manueller Winkel</option>' +
              '</select>' +
              '<button type="button" data-am-action="toggle-auto-orbit" title="Kamera automatisch um das Ziel drehen">360° AUS</button>' +
              '<button type="button" class="dnx-am-follow-stop" data-am-action="stop-follow" title="Folgeansicht beenden; AIS-/ADS-B-Telemetrie bleibt unverändert">Frei</button>' +
            '</div>' +
            '<div class="dnx-am-follow-row">' +
              '<label class="dnx-am-follow-slider-label">Modell-Offset <input type="range" min="-180" max="180" step="5" value="0" data-am-follow-offset aria-label="Rein visueller Modell-Drehwinkel; unabhängig von AIS-/ADS-B-Telemetrie"><span class="dnx-am-follow-offset-value" data-am-follow-offset-value>0°</span></label>' +
              '<button type="button" data-am-action="reset-model-offset" title="Visuellen Modell-Offset auf 0° zurücksetzen">Reset</button>' +
            '</div>' +
            '<div class="dnx-am-follow-note">Ziehen: Kamera-Orbit · Mausrad: Zoom · Modell-Offset nur visuell; AIS-/ADS-B-Telemetrie bleibt live</div>' +
          '</div>' +
        '</section>' +
      '</div>' +
      '<div class="dnx-am-footer">' + (key === "adsb" ? 'Typdaten: <a style="color:#b5d7ef" href="https://github.com/Mictronics/aircraft-database" target="_blank" rel="noopener noreferrer">Mictronics Aircraft Database</a> (<a style="color:#b5d7ef" href="' + APP_ROOT + '/models/adsb-realistic/bluebell-neutral/type-db/LICENSE.txt" target="_blank" rel="noopener noreferrer">ODC-By</a>) · ' : '') + 'Daten: aktives OpenWebRX-Profil · OSM + OpenSeaMap-Seemarken · keine amtliche Seekarte · nicht zur Navigation</div>';

    var rec = {
      spec: spec, win: win, viewer: null, map2d: null, loading: false, failed: false, mapFailed: false,
      maximized: false, restoreRect: null, entities: Object.create(null), entityKinds: Object.create(null),
      shipModels: Object.create(null), aircraftModels: Object.create(null), follow: null, pendingFollowId: null, followInputHandlers: null, trafficZoomHandler: null,
      cameraInputsBeforeFollow: null,
      map2dMarkers: Object.create(null), map2dTracks: Object.create(null),
      syncPending: false, didAutoFit: false, didMapAutoFit: false,
      resizeObserver: null, mapResizeObserver: null, map2dLoading: false, prefs: loadPrefs(key),
      infoPanel: null, infoTimer: null, infoIndex: 0, replayTimer: null, replayEntity: null, replayMarker: null
    };
    WINDOWS[key] = rec;
    bindWindow(rec);
    ["n", "s", "e", "w", "ne", "nw", "se", "sw"].forEach(function (direction) {
      var grip = document.createElement("div");
      grip.className = "dnx-am-grip dnx-am-grip-" + direction;
      grip.setAttribute("aria-hidden", "true");
      grip.addEventListener("pointerdown", function (event) { beginResize(event, rec, direction); });
      win.appendChild(grip);
    });
    document.body.appendChild(win);
    focusWindow(rec);
    var trackCheck = q('[data-am-option="tracks"]', win);
    var labelCheck = q('[data-am-option="labels"]', win);
    var baseSelect = q('[data-am-option="basemap"]', win);
    if (trackCheck) trackCheck.checked = !!rec.prefs.tracks;
    if (labelCheck) labelCheck.checked = !!rec.prefs.labels;
    if (baseSelect) baseSelect.value = rec.prefs.baseMap;
    syncLayerControls(rec);
    updateWindowStatus(key);
    setMapMode(rec, rec.prefs.mode, false);
    return rec;
  }

  function ensureMapsForMode(rec) {
    if (!rec || !rec.prefs) return;
    if (rec.prefs.mode === "2d" || rec.prefs.mode === "both") createMap2D(rec);
    if (rec.prefs.mode === "3d" || rec.prefs.mode === "both") createViewer(rec);
  }

  function setMapMode(rec, mode, persist) {
    if (!rec || !rec.win) return;
    if (mode === "2d" && rec.follow) stopFollow(rec, false);
    rec.prefs.mode = ["2d", "3d", "both"].indexOf(mode) >= 0 ? mode : "both";
    var body = q(".dnx-am-body", rec.win);
    if (body) body.setAttribute("data-mode", rec.prefs.mode);
    q(".dnx-am-pane-2d", rec.win).classList.toggle("hidden", rec.prefs.mode === "3d");
    q(".dnx-am-pane-3d", rec.win).classList.toggle("hidden", rec.prefs.mode === "2d");
    Array.prototype.forEach.call(rec.win.querySelectorAll("[data-am-mode]"), function (button) {
      button.classList.toggle("on", button.getAttribute("data-am-mode") === rec.prefs.mode);
      button.setAttribute("aria-pressed", button.getAttribute("data-am-mode") === rec.prefs.mode ? "true" : "false");
    });
    ensureMapsForMode(rec);
    if (persist !== false) savePrefs(rec);
    window.setTimeout(function () { resizeViewer(rec); syncMap2D(rec); syncViewer(rec); }, 120);
  }

  function loadPrefs(key) {
    var prefs = {
      tracks: true, labels: true, mode: "both", baseMap: "osm",
      aircraftSize: 1, aircraftDistance: 0,
      /* SDRangel map defaults: sun light + FXAA on, terrain/buildings off */
      sunLight: true, terrainLighting: false, terrain: false, buildings: false,
      fxaa: true, msaa: 1, labelScale: 1,
      rain: false, clouds: false, nasa: false, nasaOpacity: 50,
      groundTracks: "all", trackColor: "auto", smoothWindow: 0, smoothLambda: 1,
      filterName: "", filterDistance: 0,
      railways: false, seamarks: false, posRings: false, hdr: true
    };
    try {
      var value = JSON.parse(localStorage.getItem("dnx.airmarine." + key + ".view.v2") || "null");
      if (value && typeof value === "object") {
        if ([1, 1.5, 2, 3].indexOf(Number(value.aircraftSize)) >= 0) prefs.aircraftSize = Number(value.aircraftSize);
        if ([100, 250, 500, 1000, 3000].indexOf(Number(value.aircraftDistance)) >= 0) prefs.aircraftDistance = Number(value.aircraftDistance);
        if (value.tracks !== undefined) prefs.tracks = !!value.tracks;
        if (value.trackColor === "auto" || /^#[0-9a-f]{6}$/i.test(value.trackColor || "")) prefs.trackColor=value.trackColor;
        if (value.labels !== undefined) prefs.labels = !!value.labels;
        if (["2d", "3d", "both"].indexOf(value.mode) >= 0) prefs.mode = value.mode;
        if (BASEMAPS[value.baseMap]) prefs.baseMap = value.baseMap;
        ["sunLight", "terrainLighting", "terrain", "buildings", "fxaa", "rain", "clouds", "nasa", "railways", "seamarks", "posRings", "hdr"].forEach(function (k) {
          if (value[k] !== undefined) prefs[k] = !!value[k];
        });
        if (value.msaa !== undefined && [1, 2, 4].indexOf(Number(value.msaa)) >= 0) prefs.msaa = Number(value.msaa);
        if (value.labelScale !== undefined) prefs.labelScale = clamp(Number(value.labelScale) || 1, 0.5, 1.5);
        if (value.nasaOpacity !== undefined) prefs.nasaOpacity = clamp(Number(value.nasaOpacity) || 50, 0, 100);
        if (["all", "selected", "off"].indexOf(value.groundTracks) >= 0) prefs.groundTracks = value.groundTracks;
        if (value.smoothWindow !== undefined) prefs.smoothWindow = Math.max(0, Number(value.smoothWindow) || 0);
        if (value.smoothLambda !== undefined) prefs.smoothLambda = Math.max(0.05, Number(value.smoothLambda) || 1);
        if (value.filterName !== undefined) prefs.filterName = safeText(value.filterName);
        if (value.filterDistance !== undefined) prefs.filterDistance = Math.max(0, Number(value.filterDistance) || 0);
      }
    } catch (e) {}
    if (!baseMapAvailable(prefs.baseMap)) prefs.baseMap = "osm";
    return prefs;
  }

  function savePrefs(rec) {
    if (!rec) return;
    try { localStorage.setItem("dnx.airmarine." + rec.spec.key + ".view.v2", JSON.stringify(rec.prefs)); } catch (e) {}
  }

  function stepWheelControl(control, deltaY) {
    if (!control || control.disabled || control.readOnly || !deltaY) return false;
    var tag = String(control.tagName || "").toLowerCase();
    if (tag === "select") {
      var options = control.options || [];
      var step = deltaY > 0 ? 1 : -1;
      var index = control.selectedIndex + step;
      while (index >= 0 && index < options.length && options[index].disabled) index += step;
      if (index >= 0 && index < options.length) control.selectedIndex = index;
      return true;
    }
    if (tag !== "input" || ["range", "number"].indexOf(control.type) < 0) return false;
    var step = Number(control.step);
    if (!(step > 0)) step = 1;
    var min = control.min === "" || control.min === undefined ? -Infinity : Number(control.min);
    var max = control.max === "" || control.max === undefined ? Infinity : Number(control.max);
    var value = Number(control.value) || 0;
    control.value = String(Math.round(clamp(value + (deltaY < 0 ? step : -step), min, max) * 1000000) / 1000000);
    return true;
  }
  function handleControlWheel(event) {
    if (event.ctrlKey || event.metaKey || !event.target) return;
    var control = event.target.closest && event.target.closest("select,input[type=range],input[type=number]");
    if (!control && event.target.closest) {
      var label = event.target.closest("label");
      if (label) control = label.querySelector("select,input[type=range],input[type=number]");
    }
    if (!stepWheelControl(control, event.deltaY)) return;
    event.preventDefault(); event.stopPropagation();
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function bindWindow(rec) {
    var win = rec.win;
    win.addEventListener("wheel", handleControlWheel, { capture: true, passive: false });
    var offsetSlider = q("[data-am-follow-offset]", win);
    if (offsetSlider) {
      var applyOffset = function (event) {
        event.stopPropagation();
        setFollowModelOffset(rec, offsetSlider.value);
      };
      offsetSlider.addEventListener("input", applyOffset);
      offsetSlider.addEventListener("change", applyOffset);
      offsetSlider.addEventListener("pointerdown", function (event) {
        rec.__offsetDragging = true;
        event.stopPropagation();
      });
      function finishOffset() { rec.__offsetDragging = false; updateFollowUi(rec); }
      offsetSlider.addEventListener("pointerup", finishOffset);
      offsetSlider.addEventListener("pointercancel", finishOffset);
      offsetSlider.addEventListener("lostpointercapture", finishOffset);
    }
    win.addEventListener("pointerdown", function () { focusWindow(rec); }, true);
    var head = q(".dnx-am-head", win);
    if (head) {
      head.addEventListener("pointerdown", function (event) { beginDrag(event, rec); });
      head.addEventListener("dblclick", function (event) {
        if (event.target.closest("button")) return;
        toggleMax(rec);
      });
    }
    win.addEventListener("click", function (event) {
      var modeButton = event.target && event.target.closest && event.target.closest("[data-am-mode]");
      if (modeButton) {
        event.preventDefault();
        setMapMode(rec, modeButton.getAttribute("data-am-mode"), true);
        return;
      }
      var actionButton = event.target && event.target.closest && event.target.closest("[data-am-action]");
      var action = actionButton && actionButton.getAttribute("data-am-action");
      if (action === "fit") { event.preventDefault(); fitWindow(rec, true); }
      if (action === "home") { event.preventDefault(); fitCameraHome(rec); }
      if (action === "stop-follow") { event.preventDefault(); stopFollow(rec, true); }
      if (action === "toggle-auto-orbit") { event.preventDefault(); toggleAutoOrbit(rec); }
      if (action === "reset-model-offset") { event.preventDefault(); setFollowModelOffset(rec, 0); }
      if (action === "min") { event.preventDefault(); minimizeWindow(rec); }
      if (action === "max") { event.preventDefault(); toggleMax(rec); }
      if (action === "layers") { event.preventDefault(); toggleLayersPanel(rec); return; }
      if (action === "layers-close") {
        event.preventDefault();
        var panel = q("[data-am-layers]", rec.win);
        if (panel) panel.hidden = true;
        return;
      }
      if (action === "close") { event.preventDefault(); closeWindow(rec.spec.key); }
    });
    win.addEventListener("change", function (event) {
      if (event.target && event.target.hasAttribute && event.target.hasAttribute("data-am-follow-preset")) {
        setFollowPreset(rec, event.target.value);
        return;
      }
      var layerName = event.target && event.target.getAttribute && event.target.getAttribute("data-am-layer");
      if (layerName) {
        applyLayerOption(rec, layerName, event.target);
        return;
      }
      var option = event.target && event.target.getAttribute("data-am-option");
      if (option === "basemap") {
        setBaseMap(rec, event.target.value);
        return;
      }
      if (option === "tracks" || option === "labels") {
        rec.prefs[option] = !!event.target.checked;
        if (option === "tracks" && rec.prefs.tracks && rec.prefs.groundTracks === "off") rec.prefs.groundTracks="all";
        savePrefs(rec);
        scheduleSync(rec.spec.key);
      }
    });
    win.addEventListener("input", function (event) {
      var layerName = event.target && event.target.getAttribute && event.target.getAttribute("data-am-layer");
      if (layerName && (layerName === "labelScale" || layerName === "filterName")) {
        applyLayerOption(rec, layerName, event.target);
        return;
      }
      if (event.target && event.target.hasAttribute && event.target.hasAttribute("data-am-follow-offset")) {
        setFollowModelOffset(rec, event.target.value);
      }
    });
  }

  function focusWindow(rec) {
    if (!rec || !rec.win || rec.win.style.display === "none") return;
    Object.keys(WINDOWS).forEach(function (key) {
      var other = WINDOWS[key];
      if (other && other.win) other.win.classList.remove("dnx-am-active");
    });
    rec.win.classList.add("dnx-am-active");
    stack = (stack + 1) % 500;
    rec.win.style.zIndex = String(STACK_BASE + stack);
    syncToolbarButtons();
  }

  function focusNextWindow() {
    var visible = Object.keys(WINDOWS).map(function (key) { return WINDOWS[key]; })
      .filter(function (rec) { return rec && rec.win && rec.win.isConnected && rec.win.style.display !== "none"; });
    visible.sort(function (a, b) {
      return (parseInt(a.win.style.zIndex, 10) || 0) - (parseInt(b.win.style.zIndex, 10) || 0);
    });
    if (visible.length) focusWindow(visible[visible.length - 1]);
    else syncToolbarButtons();
  }

  function minimizeWindow(rec) {
    if (!rec || !rec.win) return;
    if (contextMenu && contextMenu.__dnxOwner === rec) hideContextMenu();
    rec.win.style.display = "none";
    rec.win.classList.remove("dnx-am-active");
    focusNextWindow();
  }

  function closeWindow(key) {
    var rec = WINDOWS[key];
    if (!rec) return;
    saveRect(rec);
    safeDestroyViewer(rec);
    try { if (rec.win && rec.win.parentNode) rec.win.parentNode.removeChild(rec.win); } catch (e) {}
    delete WINDOWS[key];
    focusNextWindow();
  }

  function toggleMax(rec) {
    if (!rec || !rec.win) return;
    if (!rec.maximized) {
      var r = rec.win.getBoundingClientRect();
      rec.restoreRect = { left: r.left, top: r.top, width: r.width, height: r.height };
      rec.maximized = true;
      var v = viewport();
      setRect(rec.win, { left: 8, top: 8, width: v.w - 16, height: v.h - 16 });
    } else {
      rec.maximized = false;
      setRect(rec.win, rec.restoreRect || loadRect(rec.spec.key));
      rec.restoreRect = null;
      saveRect(rec);
    }
    focusWindow(rec);
    window.setTimeout(function () { resizeViewer(rec); }, 80);
  }

  function beginDrag(event, rec) {
    if (!rec || !rec.win || event.button !== 0 || event.target.closest("button,a,input,select,label")) return;
    if (rec.maximized) return;
    event.preventDefault();
    event.stopPropagation();
    focusWindow(rec);
    var r = rec.win.getBoundingClientRect(), sx = event.clientX, sy = event.clientY;
    var left = r.left, top = r.top;
    function move(e) {
      if (e.pointerId !== undefined && event.pointerId !== undefined && e.pointerId !== event.pointerId) return;
      e.preventDefault();
      var v = viewport();
      var maxLeft = Math.max(0, v.w - Math.min(r.width, 100));
      var maxTop = Math.max(0, v.h - 44);
      rec.win.style.left = Math.round(clamp(left + e.clientX - sx, 0, maxLeft)) + "px";
      rec.win.style.top = Math.round(clamp(top + e.clientY - sy, 0, maxTop)) + "px";
    }
    function up() {
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
      saveRect(rec);
    }
    document.addEventListener("pointermove", move, { capture: true, passive: false });
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
  }

  function beginResize(event, rec, direction) {
    if (!rec || !rec.win || event.button !== 0 || rec.maximized) return;
    event.preventDefault();
    event.stopPropagation();
    focusWindow(rec);
    var r = rec.win.getBoundingClientRect(), sx = event.clientX, sy = event.clientY;
    function move(e) {
      if (e.pointerId !== undefined && event.pointerId !== undefined && e.pointerId !== event.pointerId) return;
      e.preventDefault();
      var dx = e.clientX - sx, dy = e.clientY - sy, v = viewport(), m = minSize();
      var left = r.left, top = r.top, width = r.width, height = r.height;
      if (direction.indexOf("e") >= 0) width = r.width + dx;
      if (direction.indexOf("s") >= 0) height = r.height + dy;
      if (direction.indexOf("w") >= 0) { width = r.width - dx; left = r.left + dx; }
      if (direction.indexOf("n") >= 0) { height = r.height - dy; top = r.top + dy; }
      width = clamp(width, m.w, Math.max(m.w, v.w - 12));
      height = clamp(height, m.h, Math.max(m.h, v.h - 12));
      if (direction.indexOf("w") >= 0) left = r.right - width;
      if (direction.indexOf("n") >= 0) top = r.bottom - height;
      left = clamp(left, 0, Math.max(0, v.w - width));
      top = clamp(top, 0, Math.max(0, v.h - Math.min(height, 46)));
      setRect(rec.win, { left: left, top: top, width: width, height: height });
      resizeViewer(rec);
    }
    function up() {
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", up, true);
      saveRect(rec);
      resizeViewer(rec);
    }
    document.addEventListener("pointermove", move, { capture: true, passive: false });
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", up, true);
  }

  function toggleWindow(key) {
    var rec = WINDOWS[key];
    if (rec && rec.win && rec.win.isConnected) {
      if (rec.win.style.display === "none") {
        rec.win.style.display = "flex";
        focusWindow(rec);
        ensureMapsForMode(rec);
        window.setTimeout(function () { resizeViewer(rec); scheduleSync(key); }, 80);
      } else {
        minimizeWindow(rec);
      }
      return rec;
    }
    return createWindow(key);
  }

  /* ---------- Independent ON/OFF controls in the collapsible DNX row ---------- */

  function toolbarWindowIsVisible(key) {
    var rec = WINDOWS[key];
    return !!(rec && rec.win && rec.win.isConnected && rec.win.style.display !== "none");
  }

  function syncToolbarButtons() {
    [["adsb", "ADS-B 2D/3D"], ["ais", "AIS 2D/3D"]].forEach(function (item) {
      var key = item[0];
      var label = item[1];
      var button = byId("dnx-master-" + key);
      if (!button) return;
      var active = toolbarWindowIsVisible(key);
      var state = active ? "AN" : "AUS";
      button.textContent = label + ": " + state;
      button.title = active
        ? label + " 3D ist an. Klicken zum Ausblenden."
        : label + " 3D ist aus. Klicken zum Öffnen.";
      button.setAttribute("aria-label", label + " 3D: " + state);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.style.setProperty("background", active ? "#1f8f52" : "#666666", "important");
      button.style.setProperty("color", "#ffffff", "important");
      button.style.setProperty("border-color", active ? (key === "adsb" ? "#38bdf8" : "#86efac") : "#ffffff", "important");
    });
  }

  function ensureToolbarButtons() {
    var row = byId("dnx-master-tool-row");
    if (!row) return false;

    /* Clean up a stale combined control/menu if present from an older module. */
    ["dnx-master-airmarine", "dnx-master-airmarine-menu"].forEach(function (id) {
      var old = byId(id);
      if (old && old.parentNode) {
        try { old.parentNode.removeChild(old); } catch (e) {}
      }
    });

    [["adsb", "ADS-B 2D/3D"], ["ais", "AIS 2D/3D"]].forEach(function (item) {
      var key = item[0];
      var button = byId("dnx-master-" + key);
      if (button && button.parentNode !== row) {
        try { button.parentNode.removeChild(button); } catch (e) {}
        button = null;
      }
      if (!button) {
        button = document.createElement("button");
        button.id = "dnx-master-" + key;
        button.type = "button";
        button.className = "dnx-airmarine-tool-button";
      }
      if (!button.__dnxAirMarineToggleBound) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          toggleWindow(key);
          syncToolbarButtons();
        });
        button.__dnxAirMarineToggleBound = true;
      }
      if (button.parentNode !== row) row.appendChild(button);
    });

    syncToolbarButtons();
    return true;
  }

  function patchPanel(name) {
    var ctor = window[name];
    if (!ctor || !ctor.prototype || typeof ctor.prototype.pushMessage !== "function") return false;
    if (ctor.prototype.pushMessage.__dnxAirMarine3d) return true;
    var original = ctor.prototype.pushMessage;
    var kind = name === "AdsbMessagePanel" ? "adsb" : "ais";
    var wrapped = function (message) {
      try {
        if (kind === "adsb") ingestAdsb(message);
        else ingestAis(message);
      } catch (error) {
        try { console.warn("[DNX AirMarine 3D] Nachricht konnte nicht verarbeitet werden", error); } catch (e) {}
      }
      return original.apply(this, arguments);
    };
    wrapped.__dnxAirMarine3d = true;
    wrapped.__dnxAirMarineOriginal = original;
    ctor.prototype.pushMessage = wrapped;
    return true;
  }

  function boot() {
    installStyle();
    var toolbarReady = ensureToolbarButtons();
    patchPanel("PacketMessagePanel");
    patchPanel("AdsbMessagePanel");
    /* Avoid a page-wide MutationObserver on OpenWebRX's high-activity DOM. */
    if (!toolbarReady) {
      var toolbarAttempts = 0;
      var toolbarRetry = window.setInterval(function () {
        toolbarAttempts++;
        if (ensureToolbarButtons() || toolbarAttempts >= 40) window.clearInterval(toolbarRetry);
      }, 500);
    }
    var attempts = 0;
    var patchTimer = window.setInterval(function () {
      attempts++;
      var aisPatched = patchPanel("PacketMessagePanel");
      var adsbPatched = patchPanel("AdsbMessagePanel");
      if (attempts >= 120 || (aisPatched && adsbPatched)) {
        window.clearInterval(patchTimer);
      }
    }, 500);
    window.addEventListener("resize", function () {
      Object.keys(WINDOWS).forEach(function (key) {
        var rec = WINDOWS[key];
        if (!rec || !rec.win || rec.win.style.display === "none") return;
        if (rec.maximized) {
          var v = viewport();
          setRect(rec.win, { left: 8, top: 8, width: v.w - 16, height: v.h - 16 });
        } else {
          setRect(rec.win, rec.win.getBoundingClientRect());
        }
        resizeViewer(rec);
      });
    });
    statusTimer = window.setInterval(function () {
      ["adsb", "ais"].forEach(function (kind) {
        updateWindowStatus(kind);
        var rec = WINDOWS[kind];
        if (rec && (rec.viewer || rec.map2d) && rec.win && rec.win.style.display !== "none") scheduleSync(kind);
      });
    }, 2500);
    syncToolbarButtons();
  }

  function publicApi() {
    return {
      version: VERSION,
      open: function (key) { return createWindow(key); },
      toggle: toggleWindow,
      close: closeWindow,
      counts: function () {
        return {
          ais: { targets: Object.keys(RECORDS.ais).length, positioned: getRecords("ais").length },
          adsb: { targets: Object.keys(RECORDS.adsb).length, positioned: getRecords("adsb").length }
        };
      }
    };
  }

  if (window.__DNX_AIRMARINE_TEST__) {
    window.__DNX_AIRMARINE_TEST_API__ = {
      parseAisSentence: parseNmeaSentence,
      parseAisPackedHex: parsePackedAisHex,
      parseAisFromMessage: parseAisFromMessage,
      ingestAis: ingestAis,
      ingestAdsb: ingestAdsb,
      records: RECORDS,
      armorToBits: armorToBits,
      decodeAisBits: decodeAisBits,
      aisModelKind: aisModelKind,
      aisModelAssetKey: aisModelAssetKey,
      aisShipDimensions: aisShipDimensions,
      adsbModelAssetKey: adsbModelAssetKey,
      exactAircraftType: exactAircraftType,
      lookupAircraftType: lookupAircraftType,
      aircraftModelNotice: aircraftModelNotice,
      aircraftModelLength: aircraftModelLength,
      aircraftModelScale: aircraftModelScale,
      aircraftSizeFactor: aircraftSizeFactor,
      installFollowInput: installFollowInput,
      zoomSelectedAircraft: zoomSelectedAircraft,
      aircraftTargetZoom: aircraftTargetZoom,
      installTrafficZoom: installTrafficZoom,
      wheelHitsSelectedTarget: wheelHitsSelectedTarget,
      buildTargetControls: buildTargetControls,
      openInfoSlideshow: openInfoSlideshow,
      aircraftDisplayProperty: aircraftDisplayProperty,
      cesiumTrackMaterial: cesiumTrackMaterial,
      refreshAircraftContrast: refreshAircraftContrast,
      installNativeFocusBounds: installNativeFocusBounds,
      pickTrafficTarget: pickTrafficTarget,
      nativeTargetFor: nativeTargetFor,
      toggleSelectedCamera: toggleSelectedCamera,
      startFollowTarget: startFollowTarget,
      stopFollow: stopFollow,
      updateFollowCamera: updateFollowCamera,
      selectTrafficTarget: selectTrafficTarget,
      updateSelectionFrame: updateSelectionFrame,
      trafficLabelNode: trafficLabelNode,
      updateTrafficLabels: updateTrafficLabels,
      applyAircraftContrast: applyAircraftContrast,
      aircraftDistanceZoom: aircraftDistanceZoom,
      setAircraftDistance: setAircraftDistance,
      setFollowModelOffset: setFollowModelOffset,
      stepWheelControl: stepWheelControl,
      handleControlWheel: handleControlWheel,
      leafletIcon: leafletIcon,
      aircraftModelForwardAxis: aircraftModelForwardAxis,
      aircraftModelAssetFile: aircraftModelAssetFile,
      normalizeAngleDegrees: normalizeAngleDegrees,
      followVisualHeading: followVisualHeading,
      followVisualHeadingFor: followVisualHeadingFor,
      shortestAngleDelta: shortestAngleDelta,
      followCameraLocal: followCameraLocal,
      aisFocusHeight: aisFocusHeight,
      normalizePhotoText: normalizePhotoText,
      shipPhotoName: shipPhotoName,
      exactShipPhotoScore: exactShipPhotoScore,
      exactShipPhotoQueries: exactShipPhotoQueries,
      getShipPhoto: getShipPhoto,
      typeShipPhotoScore: typeShipPhotoScore,
      aircraftPhotoQueries: aircraftPhotoQueries,
      aircraftRegistration: aircraftRegistration,
      aircraftExternalLinks: aircraftExternalLinks,
      exactAircraftPhotoScore: exactAircraftPhotoScore,
      getAircraftPhoto: getAircraftPhoto,
      exactAircraftPhotoScore: exactAircraftPhotoScore,
      typeAircraftPhotoScore: typeAircraftPhotoScore,
      updateMotion2d: updateMotion2d,
      extrapolate2d: extrapolate2d,
      syncMap2D: syncMap2D,
      baseMaps: BASEMAPS,
      baseMapAvailable: baseMapAvailable,
      baseMapTileUrl: baseMapTileUrl,
      installMotionTicker: installMotionTicker,
      livePositionFor: livePositionFor,
      whittaker: whittaker,
      smoothTrackPoints: smoothTrackPoints,
      haversineKm: haversineKm,
      recordPassesFilters: recordPassesFilters,
      trackDisplayPoints: trackDisplayPoints,
      trackColors: trackColors,
      trackShow: trackShow,
      trackContrast2D: trackContrast2D,
      createTrack2D: createTrack2D,
      styleTrack2D: styleTrack2D,
      gibsUrl: gibsUrl,
      layersPanelHtml: layersPanelHtml,
      windows: WINDOWS,
      aisModelMatrix: aisModelMatrix,
      updateFollowCamera: updateFollowCamera,
      addPositionSample: addPositionSample,
      sampledPositionFor: sampledPositionFor
    };
    return;
  }

  window.DNXAirMarine3D = publicApi();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
