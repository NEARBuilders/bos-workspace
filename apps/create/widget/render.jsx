// --------------------------------------------------------
// Takes a Markdown string and renders it to HTML.
// --------------------------------------------------------

const content = props.content;

const code = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Marked in the browser</title>
  <script src="https://unpkg.com/iframe-resizer@4.3.6/js/iframeResizer.contentWindow.min.js"></script>
  <script
  type="module"
  src="https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js"></script>
</head>
<body>
    <zero-md>
        <template>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@4/github-markdown.min.css"
            />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css"
            />
        </template>
        <script type="text/markdown" id="content">
        </script>
    </zero-md>
    <script>
        

        const handleMessage = (m) => {
            const markdownContent = m.content;
            const contentElement = document.getElementById("content");
            contentElement.innerHTML = markdownContent;
        };

        window.iFrameResizer = {
            onMessage: handleMessage
        };
    </script>
</body>
</html>
`;

return (
  <div
    className="w-100"
    style={{
      minHeight: "300px",
      minWidth: "300px",
    }}
  >
    <iframe
      iframeResizer
      className="w-100"
      srcDoc={code}
      message={{
        content,
      }}
    />
  </div>
);
