/**
 * Preview iframe entry point for the page builder.
 *
 * GET /api/preview?id=<pageId>&secret=<PREVIEW_SECRET>
 *
 * Returns an HTML shell that listens for `LAYOUT_UPDATE` postMessage
 * payloads from the parent window (the page builder canvas) and
 * re-renders a representation of the layout. A real implementation
 * would mount the frontend page renderer; this stub validates the
 * secret and wires the postMessage bridge so the rest of 4.1 can
 * iterate against a working preview surface.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get('id')
  const secret = searchParams.get('secret')
  const expected = process.env.PREVIEW_SECRET

  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Preview ${id}</title>
<style>
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #333; }
  .layout-wrap { padding: 24px; }
  .zone { border: 1px dashed #d4d4d8; border-radius: 6px; padding: 16px; margin-bottom: 12px; }
  .zone h3 { margin: 0 0 8px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
  .component { background: #f4f4f5; padding: 8px 10px; border-radius: 4px; margin: 4px 0; font-size: 13px; }
</style>
</head>
<body>
  <div id="root" class="layout-wrap">
    <p style="color:#888;font-size:13px">Waiting for layout from builder…</p>
  </div>
<script>
(function () {
  var root = document.getElementById('root');
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function render(layout) {
    if (!layout || !layout.zones) {
      root.innerHTML = '<p style="color:#888">Empty layout.</p>';
      return;
    }
    var html = '';
    Object.keys(layout.zones).forEach(function (zoneName) {
      var components = layout.zones[zoneName] || [];
      html += '<div class="zone" data-builder-zone="' + escapeHtml(zoneName) + '">';
      html += '<h3>' + escapeHtml(zoneName) + '</h3>';
      components.forEach(function (c) {
        var t = c.type || 'component';
        var label = (c.props && (c.props.heading || c.props.title || c.props.text)) || t;
        html += '<div class="component" '
          + 'data-builder-component-id="' + escapeHtml(c.id) + '" '
          + 'data-builder-component-type="' + escapeHtml(t) + '" '
          + 'data-builder-field="primary">'
          + escapeHtml(label) + '</div>';
      });
      html += '</div>';
    });
    root.innerHTML = html;
  }
  function postSelected(target) {
    var componentId = target.getAttribute('data-builder-component-id');
    var zone = (target.closest('[data-builder-zone]') || {}).getAttribute && target.closest('[data-builder-zone]').getAttribute('data-builder-zone');
    var field = target.getAttribute('data-builder-field') || 'primary';
    if (componentId && window.parent && window.parent.postMessage) {
      window.parent.postMessage({ type: 'SELECT_ELEMENT', componentId: componentId, zone: zone, field: field }, '*');
    }
  }
  document.addEventListener('mouseover', function (e) {
    var t = e.target.closest && e.target.closest('[data-builder-component-id]');
    if (t) {
      t.style.outline = '2px solid #3b82f6';
      window.parent && window.parent.postMessage({ type: 'HOVER_ELEMENT', componentId: t.getAttribute('data-builder-component-id') }, '*');
    }
  });
  document.addEventListener('mouseout', function (e) {
    var t = e.target.closest && e.target.closest('[data-builder-component-id]');
    if (t) t.style.outline = '';
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-builder-component-id]');
    if (t) {
      e.preventDefault();
      postSelected(t);
      // Make text fields directly editable on click (Level 3).
      if (t.getAttribute('data-builder-field') && !t.isContentEditable) {
        t.setAttribute('contenteditable', 'true');
        t.focus();
      }
    }
  });
  // Serialize edits and post FIELD_UPDATE on blur.
  document.addEventListener('blur', function (e) {
    var t = e.target.closest && e.target.closest('[data-builder-component-id][contenteditable="true"]');
    if (t) {
      var componentId = t.getAttribute('data-builder-component-id');
      var zone = (t.closest('[data-builder-zone]') || {}).getAttribute && t.closest('[data-builder-zone]').getAttribute('data-builder-zone');
      var field = t.getAttribute('data-builder-field') || 'primary';
      var value = t.innerText;
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type: 'FIELD_UPDATE', componentId: componentId, zone: zone, field: field, value: value }, '*');
      }
      t.removeAttribute('contenteditable');
    }
  }, true);
  window.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data && data.type === 'LAYOUT_UPDATE' && data.payload) {
      render(data.payload);
    }
  });
  // Tell parent we're ready so it can post the initial layout.
  if (window.parent && window.parent.postMessage) {
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
  }
})();
</script>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  })
}
