import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Widget } from "near-social-vm";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "index.scss";
import useRedirectMap from "./useRedirectMap";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { useInitNear } from "near-social-vm";

function Viewer({ widgetSrc, code }) {
    const [widgetProps, setWidgetProps] = useState({});
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setWidgetProps(
            Array.from(searchParams.entries()).reduce((props, [key, value]) => {
                props[key] = value;
                return props;
            }, {}),
        );
    }, [location]);

    let src;

    if (!code) {
        // prioritize code if provided
        src = widgetSrc || location.pathname.substring(1);
        if (src) {
            src = src.substring(src.lastIndexOf("/", src.indexOf(".near")) + 1);
        } else {
            src = "sking.near/widget/Explorer";
        }
    }

    const { components: redirectMap } = useRedirectMap();

    return (
        <Widget
            src={src}
            code={code}
            props={widgetProps}
            config={{ redirectMap }}
        />
    );
}

function Home() {
    const { components: redirectMap } = useRedirectMap();

    return (
        <div className="container">
            <div className="row mt-3 mb-2">
                <span>Your widgets:</span>
            </div>
            <div className="row mb-2">
                <ul className="list-group">
                    {Object.keys(redirectMap).map((key) => (
                        <li className="list-group-item">
                            <Link to={key}>{key}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function App(props) {
    const { initNear } = useInitNear();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initNear &&
            initNear({
                networkId: "mainnet",
                customElements: {
                    Link: (props) => {
                        if (!props.to && props.href) {
                            props.to = props.href;
                            delete props.href;
                        }
                        if (props.to) {
                            props.to = sanitizeUrl(props.to);
                        }
                        return <Link {...props} />;
                    },
                },
                config: {
                    defaultFinality: undefined,
                },
            });
        setReady(true);
    }, [initNear]);

    if (!ready) {
        console.log("not ready");
        return null;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="*"
                    element={
                        <Viewer
                            widgetSrc={props.widgetSrc}
                            code={props.code}
                        ></Viewer>
                    }
                />
            </Routes>
        </Router>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
