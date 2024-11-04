let tracker = 0;

export function generateID(prefix?: string) {
  // const t = (new Date()).getTime();
  // const r = `${Math.floor((Math.random() * 8999) + 1000)}`;

  // let parts = [t, r];
  // if (prefix !== undefined) parts = [prefix, ...parts];

  // return parts.map((p) => p.toString()).join('-');
  if (prefix !== undefined) {
    tracker += 1;
    return `${prefix}-${tracker - 1}`
  } else {
    return `${tracker - 1}`
  }
}