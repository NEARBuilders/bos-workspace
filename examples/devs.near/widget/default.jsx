const { message } = props;

return (
  <div className="container">
    <div className="alert alert-success mt-5" role="alert">
      <h4 className="alert-heading">{message ?? "Success!"}</h4>
      <p>You have successfully deployed a near-bos-webcomponent to web4.</p>
      <hr />
      <p className="mb-0">
        Customize the <span className="bg-warning">web4/index</span> in your{" "}
        <span className="bg-warning">bos.config.json</span> to designate the
        default widget you want to replace this page, then rebuild and redeploy.
      </p>
    </div>
  </div>
);
