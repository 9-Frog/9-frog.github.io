export const shop = {
  name: 'Sam Cutz',
  address: '289 Carlton Hill, Carlton, Nottingham NG4 1GP',
  mapsUrl: 'https://maps.app.goo.gl/PGShKRzrZHnrnAJM9',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2403.018766864367!2d-1.1066308!3d52.966076799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879c14c12e132c1%3A0x57983dfde3de284!2sSam%20cutz!5e0!3m2!1sen!2sgb!4v1791202910631!5m2!1sen!2sgb',
  // Add the owner's WhatsApp number here in international digits, without + or spaces.
  whatsappNumber: '',
};

const calendarStamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

// Interpret the selected wall-clock time in Nottingham, independently of the visitor's timezone.
export function londonDateTime(date, minutes) {
  const wallTime = Date.parse(`${date}T00:00:00Z`) + minutes * 60000;
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  let instant = wallTime;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(part => [part.type, part.value]));
    const displayed = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    const correction = wallTime - displayed;
    instant += correction;
    if (!correction) break;
  }
  return new Date(instant);
}

const escapeText = value => String(value).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
function foldLine(line) {
  const encoder = new TextEncoder();
  let folded = '', count = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (count + bytes > 75) { folded += '\r\n '; count = 1; }
    folded += character;
    count += bytes;
  }
  return folded;
}

export function calendarEvent({date, start, minutes, barber, services, price}, now = new Date()) {
  const begins = londonDateTime(date, start);
  const ends = new Date(begins.getTime() + minutes * 60000);
  const summary = 'Sam Cutz — planned visit';
  const location = `${shop.name}, ${shop.address}`;
  const description = `Barber: ${barber.name}\nServices: ${services.map(s => s.name).join(', ')}\nDuration: ${minutes} minutes\nEstimated total: ${price}\nAll appointment times are Europe/London.\n\nBooking preview only. No appointment has been reserved or sent to the shop.\n\nFind us: ${shop.mapsUrl}`;
  const uid = `${date}-${start}-${barber.id}-${services.map(s => s.id).join('-')}@sam-cutz-nottingham.rodinyastat.chatgpt.site`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sam Cutz//Visit Planner//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT', `UID:${uid}`,
    `DTSTAMP:${calendarStamp(now)}`, `DTSTART:${calendarStamp(begins)}`, `DTEND:${calendarStamp(ends)}`,
    `SUMMARY:${escapeText(summary)}`, `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`, `URL:${shop.mapsUrl}`, 'STATUS:TENTATIVE',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  const params = new URLSearchParams({action:'TEMPLATE', text:summary,
    dates:`${calendarStamp(begins)}/${calendarStamp(ends)}`, ctz:'Europe/London',
    details:description, location});
  return {
    ics: lines.map(foldLine).join('\r\n') + '\r\n',
    googleUrl: `https://calendar.google.com/calendar/render?${params}`,
    filename: `sam-cutz-${date}.ics`,
  };
}
