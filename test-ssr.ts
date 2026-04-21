import { renderToString } from 'react-dom/server';
import React from 'react';
import { LicensesSection } from './client/src/components/LicensesSection';
try {
  const html = renderToString(React.createElement(LicensesSection));
  console.log("SUCCESS length:", html.length);
} catch (e) {
  console.error("REACT CRASH ERROR:", e);
}
