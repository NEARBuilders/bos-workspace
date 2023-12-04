import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNavigation = styled.div`
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #000;
    z-index: 1000;
    padding: 12px 0;

    .user-section {
        margin-left: auto;
        > button {
            font-size: 14px;
        }
    }

    .container {
        display: flex;
        align-items: center;

        .navigation-section {
            margin-left: 50px;
            display: flex;

            > div {
                > a {
                    margin-right: 20px;
                }
            }
        }

        .user-section {
            display: flex;
            align-items: center;

            .nav-create-btn {
                margin-left: 10px;
            }

            .nav-sign-in-btn {
                margin-left: 10px;
            }
        }

        .arrow-up-right {
            margin-left: 4px;
        }
    }
`;

export function NavigationWrapper(props) {
    return (
        <StyledNavigation>
            <div className="container">
                <Link
                    to="/"
                    className="text-white text-2xl font-black"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    bos-workspace
                </Link>
                <div className="navigation-section"></div>
                <div className="user-section">
                    {!props.signedIn && (
                        <button onClick={() => props.requestSignIn()}>
                            Sign in
                        </button>
                    )}
                    {props.signedIn && (
                        <>
                            <span className="text-white me-4">
                                {`Signed in as ${props.signedAccountId}`}
                            </span>
                            <button onClick={() => props.logOut()}>
                                Sign out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </StyledNavigation>
    );
}
