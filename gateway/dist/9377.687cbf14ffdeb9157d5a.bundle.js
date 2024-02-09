"use strict";
(self.webpackChunkbos_workspace_gateway =
  self.webpackChunkbos_workspace_gateway || []).push([
  [9377],
  {
    99377: (e, n, t) => {
      t.r(n), t.d(n, { default: () => tn });
      var o = t(4511),
        r = t(94975),
        a = t(97582),
        i = (function (e) {
          function n(n, t) {
            return e.call(this) || this;
          }
          return (
            (0, a.ZT)(n, e),
            (n.prototype.schedule = function (e, n) {
              return void 0 === n && (n = 0), this;
            }),
            n
          );
        })(t(35720).w0),
        c = {
          setInterval: function (e, n) {
            for (var t = [], o = 2; o < arguments.length; o++)
              t[o - 2] = arguments[o];
            var r = c.delegate;
            return (null == r ? void 0 : r.setInterval)
              ? r.setInterval.apply(r, (0, a.ev)([e, n], (0, a.CR)(t)))
              : setInterval.apply(void 0, (0, a.ev)([e, n], (0, a.CR)(t)));
          },
          clearInterval: function (e) {
            var n = c.delegate;
            return ((null == n ? void 0 : n.clearInterval) || clearInterval)(e);
          },
          delegate: void 0,
        },
        l = t(3699),
        s = (function (e) {
          function n(n, t) {
            var o = e.call(this, n, t) || this;
            return (o.scheduler = n), (o.work = t), (o.pending = !1), o;
          }
          return (
            (0, a.ZT)(n, e),
            (n.prototype.schedule = function (e, n) {
              var t;
              if ((void 0 === n && (n = 0), this.closed)) return this;
              this.state = e;
              var o = this.id,
                r = this.scheduler;
              return (
                null != o && (this.id = this.recycleAsyncId(r, o, n)),
                (this.pending = !0),
                (this.delay = n),
                (this.id =
                  null !== (t = this.id) && void 0 !== t
                    ? t
                    : this.requestAsyncId(r, this.id, n)),
                this
              );
            }),
            (n.prototype.requestAsyncId = function (e, n, t) {
              return (
                void 0 === t && (t = 0), c.setInterval(e.flush.bind(e, this), t)
              );
            }),
            (n.prototype.recycleAsyncId = function (e, n, t) {
              if (
                (void 0 === t && (t = 0),
                null != t && this.delay === t && !1 === this.pending)
              )
                return n;
              null != n && c.clearInterval(n);
            }),
            (n.prototype.execute = function (e, n) {
              if (this.closed) return new Error("executing a cancelled action");
              this.pending = !1;
              var t = this._execute(e, n);
              if (t) return t;
              !1 === this.pending &&
                null != this.id &&
                (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
            }),
            (n.prototype._execute = function (e, n) {
              var t,
                o = !1;
              try {
                this.work(e);
              } catch (e) {
                (o = !0),
                  (t = e || new Error("Scheduled action threw falsy error"));
              }
              if (o) return this.unsubscribe(), t;
            }),
            (n.prototype.unsubscribe = function () {
              if (!this.closed) {
                var n = this.id,
                  t = this.scheduler,
                  o = t.actions;
                (this.work = this.state = this.scheduler = null),
                  (this.pending = !1),
                  (0, l.P)(o, this),
                  null != n && (this.id = this.recycleAsyncId(t, n, null)),
                  (this.delay = null),
                  e.prototype.unsubscribe.call(this);
              }
            }),
            n
          );
        })(i),
        d = t(94318),
        u = (function () {
          function e(n, t) {
            void 0 === t && (t = e.now),
              (this.schedulerActionCtor = n),
              (this.now = t);
          }
          return (
            (e.prototype.schedule = function (e, n, t) {
              return (
                void 0 === n && (n = 0),
                new this.schedulerActionCtor(this, e).schedule(t, n)
              );
            }),
            (e.now = d.l.now),
            e
          );
        })(),
        m = new ((function (e) {
          function n(n, t) {
            void 0 === t && (t = u.now);
            var o = e.call(this, n, t) || this;
            return (o.actions = []), (o._active = !1), o;
          }
          return (
            (0, a.ZT)(n, e),
            (n.prototype.flush = function (e) {
              var n = this.actions;
              if (this._active) n.push(e);
              else {
                var t;
                this._active = !0;
                do {
                  if ((t = e.execute(e.state, e.delay))) break;
                } while ((e = n.shift()));
                if (((this._active = !1), t)) {
                  for (; (e = n.shift()); ) e.unsubscribe();
                  throw t;
                }
              }
            }),
            n
          );
        })(u))(s),
        p = t(96798),
        v = t(2566),
        f = t(53741),
        g = t(98536),
        h = t(4490),
        b = t(86469),
        x = t(86515),
        w = t(44367),
        y = t(87878),
        k = t(1545),
        $ = t(57617),
        C = t(11954),
        j = t(40448),
        z =
          (t(51206),
          t(46748),
          t(70794),
          t(28451),
          t(42705),
          t(72378),
          t(26729),
          '<svg width="100%" height="24" viewBox="0 5 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10H7Z" fill="currentColor"/></svg>'),
        A =
          '\n  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>\n  </svg>\n';
      function G(e) {
        (0, o.a)(
          e,
          "svelte-1uqued6",
          "select.svelte-1uqued6{border:none;background-image:none;background-color:transparent;-webkit-appearance:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;appearance:none;font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));transition:width 250ms ease-in-out;background-repeat:no-repeat, repeat;background-position:right 0px top 0px, 0 0;scrollbar-width:none;-ms-overflow-style:none;padding:0 14px 0 0;white-space:nowrap;text-overflow:ellipsis}select.minimized_ac.svelte-1uqued6{min-width:80px;max-width:80px}select.maximized_ac.svelte-1uqued6{width:auto !important}select.svelte-1uqued6:focus{outline:none}span.switching-placeholder.svelte-1uqued6{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));min-width:80px;max-width:80px;padding:0 8px 0 4px}",
        );
      }
      function I(e, n, t) {
        const o = e.slice();
        return (o[15] = n[t]), o;
      }
      function T(e) {
        let n;
        function t(e, n) {
          return e[7] ? F : _;
        }
        let r = t(e),
          a = r(e);
        return {
          c() {
            a.c(), (n = (0, o.e)());
          },
          m(e, t) {
            a.m(e, t), (0, o.b)(e, n, t);
          },
          p(e, o) {
            r === (r = t(e)) && a
              ? a.p(e, o)
              : (a.d(1), (a = r(e)), a && (a.c(), a.m(n.parentNode, n)));
          },
          d(e) {
            a.d(e), e && (0, o.d)(n);
          },
        };
      }
      function _(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s = !(0, o.h)(e[6].chains[0], e[2]),
          d = [],
          u = new Map(),
          m = s && H(e),
          p = e[2];
        const v = (e) => e[15].id;
        for (let n = 0; n < p.length; n += 1) {
          let t = I(e, p, n),
            o = v(t);
          u.set(o, (d[n] = L(o, t)));
        }
        return {
          c() {
            (n = (0, o.j)("select")), m && m.c(), (t = (0, o.e)());
            for (let e = 0; e < d.length; e += 1) d[e].c();
            (0, o.k)(
              n,
              "class",
              (r =
                (0, o.l)(`flex justify-center items-center pointer ${e[4]}`) +
                " svelte-1uqued6"),
            ),
              (0, o.k)(
                n,
                "style",
                (i = `\n        color: var(${e[1]},\n        var(--account-center-network-selector-color, var(--gray-500)));\n        background-image: url('data:image/svg+xml;utf8,${e[0]}'); ${e[3] ? "font-weight: 600;" : ""}`),
              );
          },
          m(r, a) {
            (0, o.b)(r, n, a), m && m.m(n, null), (0, o.m)(n, t);
            for (let e = 0; e < d.length; e += 1) d[e] && d[e].m(n, null);
            (0, o.o)(n, e[6].chains[0].id),
              e[13](n),
              c || ((l = (0, o.p)(n, "change", e[10])), (c = !0));
          },
          p(e, c) {
            68 & c && (s = !(0, o.h)(e[6].chains[0], e[2])),
              s
                ? m
                  ? m.p(e, c)
                  : ((m = H(e)), m.c(), m.m(n, t))
                : m && (m.d(1), (m = null)),
              4 & c &&
                ((p = e[2]),
                (d = (0, o.u)(d, c, v, 1, e, p, u, n, o.q, L, null, I))),
              16 & c &&
                r !==
                  (r =
                    (0, o.l)(
                      `flex justify-center items-center pointer ${e[4]}`,
                    ) + " svelte-1uqued6") &&
                (0, o.k)(n, "class", r),
              64 & c &&
                a !== (a = e[6].chains[0].id) &&
                (0, o.o)(n, e[6].chains[0].id),
              11 & c &&
                i !==
                  (i = `\n        color: var(${e[1]},\n        var(--account-center-network-selector-color, var(--gray-500)));\n        background-image: url('data:image/svg+xml;utf8,${e[0]}'); ${e[3] ? "font-weight: 600;" : ""}`) &&
                (0, o.k)(n, "style", i);
          },
          d(t) {
            t && (0, o.d)(n), m && m.d();
            for (let e = 0; e < d.length; e += 1) d[e].d();
            e[13](null), (c = !1), l();
          },
        };
      }
      function F(e) {
        let n, t, r, a;
        return {
          c() {
            (n = (0, o.j)("span")),
              (t = (0, o.t)("switching...")),
              (0, o.k)(
                n,
                "class",
                (r =
                  (0, o.l)(`switching-placeholder ${e[4]}`) +
                  " svelte-1uqued6"),
              ),
              (0, o.k)(
                n,
                "style",
                (a = `\n        color: var(${e[1]},\n        var(--account-center-network-selector-color, var(--gray-500)));\n      `),
              );
          },
          m(e, r) {
            (0, o.b)(e, n, r), (0, o.m)(n, t);
          },
          p(e, t) {
            16 & t &&
              r !==
                (r =
                  (0, o.l)(`switching-placeholder ${e[4]}`) +
                  " svelte-1uqued6") &&
              (0, o.k)(n, "class", r),
              2 & t &&
                a !==
                  (a = `\n        color: var(${e[1]},\n        var(--account-center-network-selector-color, var(--gray-500)));\n      `) &&
                (0, o.k)(n, "style", a);
          },
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function H(e) {
        let n,
          t,
          r,
          a = (o.r[e[6].chains[0].id] || "unrecognized") + "";
        return {
          c() {
            (n = (0, o.j)("option")),
              (t = (0, o.t)(a)),
              (n.__value = r = e[6].chains[0].id),
              (n.value = n.__value);
          },
          m(e, r) {
            (0, o.b)(e, n, r), (0, o.m)(n, t);
          },
          p(e, i) {
            64 & i &&
              a !== (a = (o.r[e[6].chains[0].id] || "unrecognized") + "") &&
              (0, o.v)(t, a),
              64 & i &&
                r !== (r = e[6].chains[0].id) &&
                ((n.__value = r), (n.value = n.__value));
          },
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function L(e, n) {
        let t,
          r,
          a,
          i = (n[15].label || o.r[n[15].id] || n[15].id) + "";
        return {
          key: e,
          first: null,
          c() {
            (t = (0, o.j)("option")),
              (r = (0, o.t)(i)),
              (t.__value = a = n[15].id),
              (t.value = t.__value),
              (this.first = t);
          },
          m(e, n) {
            (0, o.b)(e, t, n), (0, o.m)(t, r);
          },
          p(e, c) {
            (n = e),
              4 & c &&
                i !== (i = (n[15].label || o.r[n[15].id] || n[15].id) + "") &&
                (0, o.v)(r, i),
              4 & c &&
                a !== (a = n[15].id) &&
                ((t.__value = a), (t.value = t.__value));
          },
          d(e) {
            e && (0, o.d)(t);
          },
        };
      }
      function M(e) {
        let n,
          t = e[6] && T(e);
        return {
          c() {
            t && t.c(), (n = (0, o.e)());
          },
          m(e, r) {
            t && t.m(e, r), (0, o.b)(e, n, r);
          },
          p(e, [o]) {
            e[6]
              ? t
                ? t.p(e, o)
                : ((t = T(e)), t.c(), t.m(n.parentNode, n))
              : t && (t.d(1), (t = null));
          },
          i: o.n,
          o: o.n,
          d(e) {
            t && t.d(e), e && (0, o.d)(n);
          },
        };
      }
      function P(e, n, t) {
        let a, i, c, l;
        (0, o.c)(e, o.w, (e) => t(12, (c = e)));
        let { selectIcon: s = z } = n,
          { colorVar: d } = n,
          { chains: u } = n,
          { bold: g = !1 } = n,
          { parentCSSId: h = "" } = n;
        const b = new x.X(!1);
        let j;
        (0, o.c)(e, b, (e) => t(7, (l = e)));
        const A = (function () {
          for (var e = [], n = 0; n < arguments.length; n++)
            e[n] = arguments[n];
          var t = (0, $.yG)(e),
            o = (0, $._6)(e, 1 / 0),
            r = e;
          return r.length
            ? 1 === r.length
              ? (0, y.Xf)(r[0])
              : (0, w.J)(o)((0, C.D)(r, t))
            : k.E;
        })(
          o.w,
          b.pipe(
            (1,
            (0, r.h)(function (e, n) {
              return 1 <= n;
            })),
          ),
        ).pipe(
          (50,
          void 0 === G && (G = m),
          (0, p.e)(function (e, n) {
            var t = null,
              o = null,
              r = null,
              a = function () {
                if (t) {
                  t.unsubscribe(), (t = null);
                  var e = o;
                  (o = null), n.next(e);
                }
              };
            function i() {
              var e = r + 50,
                o = G.now();
              if (o < e)
                return (t = this.schedule(void 0, e - o)), void n.add(t);
              a();
            }
            e.subscribe(
              (0, v.x)(
                n,
                function (e) {
                  (o = e),
                    (r = G.now()),
                    t || ((t = G.schedule(i, 50)), n.add(t));
                },
                function () {
                  a(), n.complete();
                },
                void 0,
                function () {
                  o = t = null;
                },
              ),
            );
          })),
          (0, f.x)(
            (e, n) =>
              "boolean" != typeof e &&
              "boolean" != typeof n &&
              e[0] &&
              n[0] &&
              e[0].chains[0].id === n[0].chains[0].id,
          ),
        );
        var G;
        return (
          (0, o.c)(e, A, (e) => t(11, (i = e))),
          (e.$$set = (e) => {
            "selectIcon" in e && t(0, (s = e.selectIcon)),
              "colorVar" in e && t(1, (d = e.colorVar)),
              "chains" in e && t(2, (u = e.chains)),
              "bold" in e && t(3, (g = e.bold)),
              "parentCSSId" in e && t(4, (h = e.parentCSSId));
          }),
          (e.$$.update = () => {
            4096 & e.$$.dirty && t(6, ([a] = c), a),
              2048 & e.$$.dirty &&
                i &&
                (function () {
                  if (!j) return;
                  let e = document.createElement("option");
                  e.textContent = j.selectedOptions[0].textContent;
                  let n = document.createElement("select");
                  (n.style.visibility = "hidden"),
                    (n.style.position = "fixed"),
                    n.appendChild(e),
                    j.after(n),
                    t(5, (j.style.width = n.clientWidth - 22 + "px"), j),
                    n.remove();
                })();
          }),
          [
            s,
            d,
            u,
            g,
            h,
            j,
            a,
            l,
            b,
            A,
            async function () {
              const e = j.selectedOptions[0].value;
              e !== a.chains[0].id &&
                (b.next(!0),
                await (0, o.f)({
                  chainId: e,
                  chainNamespace: "evm",
                  wallet: a.label,
                }),
                b.next(!1));
            },
            i,
            c,
            function (e) {
              o.g[e ? "unshift" : "push"](() => {
                (j = e), t(5, j), t(2, u), t(6, a), t(12, c);
              });
            },
          ]
        );
      }
      class S extends o.S {
        constructor(e) {
          super(),
            (0, o.i)(
              this,
              e,
              P,
              M,
              o.s,
              {
                selectIcon: 0,
                colorVar: 1,
                chains: 2,
                bold: 3,
                parentCSSId: 4,
              },
              G,
            );
        }
      }
      var V =
        '\n  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>\n  </svg>\n';
      function q(e) {
        (0, o.a)(
          e,
          "svelte-hb2n95",
          ".container.svelte-hb2n95.svelte-hb2n95{display:flex;align-items:center;gap:0.5rem;cursor:pointer;position:relative;z-index:0;width:100%;padding:0.25rem;margin-bottom:0.25rem;border-radius:12px;transition:background-color 150ms ease-in-out}.container.svelte-hb2n95.svelte-hb2n95::before{content:'';display:block;position:absolute;top:0;bottom:0;left:0;right:0;height:100%;width:100%;background:var(--action-color);border-radius:12px;z-index:-1;opacity:0}.container.svelte-hb2n95.svelte-hb2n95:hover::before{opacity:0.2}.container.svelte-hb2n95:hover .balance.svelte-hb2n95,.container.svelte-hb2n95:hover .elipsis-container.svelte-hb2n95{opacity:1}.container.svelte-hb2n95:hover .balance.svelte-hb2n95{color:var(--account-center-maximized-balance-color, inherit)}.container.primary.svelte-hb2n95.svelte-hb2n95:hover{background-color:var(\n      --account-center-maximized-account-section-background-hover\n    )}.account-details.svelte-hb2n95.svelte-hb2n95{flex:1 1;display:flex;gap:inherit;overflow:hidden}.address-domain.svelte-hb2n95.svelte-hb2n95{flex:1 0 auto;max-width:70%;white-space:nowrap;font-weight:600;color:var(--account-center-maximized-address-color, inherit);overflow:scroll;scrollbar-width:none;-ms-overflow-style:none}.address-domain.svelte-hb2n95.svelte-hb2n95::-webkit-scrollbar{display:none}.balance.svelte-hb2n95.svelte-hb2n95{flex:1 1 auto;max-width:70%;white-space:nowrap;text-align:end;opacity:0.4;transition:color 150ms ease-in-out, background-color 150ms ease-in-out;overflow:scroll;scrollbar-width:none;-ms-overflow-style:none}.balance.svelte-hb2n95.svelte-hb2n95::-webkit-scrollbar{display:none}.elipsis-container.svelte-hb2n95.svelte-hb2n95{flex:0;padding:0.25rem;border-radius:24px;transition:color 150ms ease-in-out, background-color 150ms ease-in-out;background-color:transparent;opacity:0.4}.elipsis-container.svelte-hb2n95.svelte-hb2n95:hover{color:var(--text-color)}.elipsis-container.active.svelte-hb2n95.svelte-hb2n95{color:var(--text-color)}.elipsis.svelte-hb2n95.svelte-hb2n95{width:24px}.menu.svelte-hb2n95.svelte-hb2n95{background:var(--onboard-white, var(--white));border:1px solid var(--onboard-gray-100, var(--gray-100));border-radius:8px;list-style-type:none;right:0.25rem;top:2.25rem;margin:0;padding:0;border:none;overflow:hidden;z-index:1}.menu.svelte-hb2n95 li.svelte-hb2n95{color:var(--onboard-primary-500, var(--primary-500));font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));padding:12px 16px;background:var(--onboard-white, var(--white));transition:background-color 150ms ease-in-out;cursor:pointer}.menu.svelte-hb2n95 li.svelte-hb2n95:hover{background:var(--onboard-primary-200, var(--primary-200))}",
        );
      }
      function D(e, n, t) {
        const o = e.slice();
        return (
          (o[14] = n[t].address),
          (o[15] = n[t].ens),
          (o[16] = n[t].uns),
          (o[17] = n[t].balance),
          (o[19] = t),
          o
        );
      }
      function E(e) {
        let n, t, r;
        return (
          (t = new o.R({ props: { size: 14 } })),
          {
            c() {
              (n = (0, o.j)("div")),
                (0, o.F)(t.$$.fragment),
                (0, o.T)(n, "right", "-5px"),
                (0, o.T)(n, "bottom", "-5px"),
                (0, o.k)(n, "class", "drop-shadow absolute");
            },
            m(e, a) {
              (0, o.b)(e, n, a), (0, o.I)(t, n, null), (r = !0);
            },
            i(e) {
              r || ((0, o.x)(t.$$.fragment, e), (r = !0));
            },
            o(e) {
              (0, o.A)(t.$$.fragment, e), (r = !1);
            },
            d(e) {
              e && (0, o.d)(n), (0, o.K)(t);
            },
          }
        );
      }
      function Z(e) {
        let n,
          t,
          r,
          a = O(e[17]) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.t)(a)),
              (0, o.k)(n, "class", "balance svelte-hb2n95");
          },
          m(e, r) {
            (0, o.b)(e, n, r), (0, o.m)(n, t);
          },
          p(e, n) {
            1 & n && a !== (a = O(e[17]) + "") && (0, o.v)(t, a);
          },
          i(e) {
            e &&
              (r ||
                (0, o.U)(() => {
                  (r = (0, o.V)(n, o.X, {})), r.start();
                }));
          },
          o: o.n,
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function K(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f =
            e[4]("accountCenter.addAccount", {
              default: e[2].accountCenter.addAccount,
            }) + "",
          g =
            e[4]("accountCenter.disconnectWallet", {
              default: e[2].accountCenter.disconnectWallet,
            }) + "",
          h = e[2].accountCenter.copyAddress + "",
          b = !(e[1] && 0 === e[19]) && B(e);
        function x() {
          return e[13](e[15], e[16], e[14]);
        }
        return {
          c() {
            (n = (0, o.j)("ul")),
              (t = (0, o.j)("li")),
              (r = (0, o.t)(f)),
              (a = (0, o.G)()),
              b && b.c(),
              (i = (0, o.G)()),
              (c = (0, o.j)("li")),
              (l = (0, o.t)(g)),
              (s = (0, o.G)()),
              (d = (0, o.j)("li")),
              (u = (0, o.t)(h)),
              (0, o.k)(t, "class", "svelte-hb2n95"),
              (0, o.k)(c, "class", "svelte-hb2n95"),
              (0, o.k)(d, "class", "svelte-hb2n95"),
              (0, o.k)(n, "class", "menu absolute svelte-hb2n95");
          },
          m(m, f) {
            (0, o.b)(m, n, f),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.m)(n, a),
              b && b.m(n, null),
              (0, o.m)(n, i),
              (0, o.m)(n, c),
              (0, o.m)(c, l),
              (0, o.m)(n, s),
              (0, o.m)(n, d),
              (0, o.m)(d, u),
              p ||
                ((v = [
                  (0, o.p)(t, "click", (0, o.J)(e[10])),
                  (0, o.p)(c, "click", (0, o.J)(e[12])),
                  (0, o.p)(d, "click", (0, o.J)(x)),
                ]),
                (p = !0));
          },
          p(t, a) {
            (e = t),
              20 & a &&
                f !==
                  (f =
                    e[4]("accountCenter.addAccount", {
                      default: e[2].accountCenter.addAccount,
                    }) + "") &&
                (0, o.v)(r, f),
              e[1] && 0 === e[19]
                ? b && (b.d(1), (b = null))
                : b
                  ? b.p(e, a)
                  : ((b = B(e)), b.c(), b.m(n, i)),
              20 & a &&
                g !==
                  (g =
                    e[4]("accountCenter.disconnectWallet", {
                      default: e[2].accountCenter.disconnectWallet,
                    }) + "") &&
                (0, o.v)(l, g),
              4 & a &&
                h !== (h = e[2].accountCenter.copyAddress + "") &&
                (0, o.v)(u, h);
          },
          i(e) {
            e &&
              (m ||
                (0, o.U)(() => {
                  (m = (0, o.V)(n, o.X, {})), m.start();
                }));
          },
          o: o.n,
          d(e) {
            e && (0, o.d)(n), b && b.d(), (p = !1), (0, o.L)(v);
          },
        };
      }
      function B(e) {
        let n,
          t,
          r,
          a,
          i =
            e[4]("accountCenter.setPrimaryAccount", {
              default: e[2].accountCenter.setPrimaryAccount,
            }) + "";
        function c() {
          return e[11](e[14]);
        }
        return {
          c() {
            (n = (0, o.j)("li")),
              (t = (0, o.t)(i)),
              (0, o.k)(n, "class", "svelte-hb2n95");
          },
          m(e, i) {
            (0, o.b)(e, n, i),
              (0, o.m)(n, t),
              r || ((a = (0, o.p)(n, "click", (0, o.J)(c))), (r = !0));
          },
          p(n, r) {
            (e = n),
              20 & r &&
                i !==
                  (i =
                    e[4]("accountCenter.setPrimaryAccount", {
                      default: e[2].accountCenter.setPrimaryAccount,
                    }) + "") &&
                (0, o.v)(t, i);
          },
          d(e) {
            e && (0, o.d)(n), (r = !1), a();
          },
        };
      }
      function W(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f,
          g,
          h,
          b,
          x,
          w =
            (e[15]
              ? (0, o.D)(e[15].name)
              : e[16]
                ? (0, o.D)(e[16].name)
                : (0, o.E)(e[14])) + "";
        a = new o.W({
          props: {
            size: 32,
            padding: 4,
            background: "custom",
            color: "#EFF1FC",
            customBackgroundColor:
              e[1] && 0 === e[19]
                ? "rgba(24, 206, 102, 0.2)"
                : "rgba(235, 235, 237, 0.1)",
            border: e[1] && 0 === e[19] ? "green" : "gray",
            radius: 8,
            icon: e[0].icon,
          },
        });
        let y = e[1] && 0 === e[19] && E(),
          k = e[17] && Z(e);
        function $() {
          return e[8](e[14]);
        }
        function C() {
          return e[9](e[14]);
        }
        let j = e[3] === e[14] && K(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.j)("div")),
              (0, o.F)(a.$$.fragment),
              (i = (0, o.G)()),
              y && y.c(),
              (c = (0, o.G)()),
              (l = (0, o.j)("div")),
              (s = (0, o.j)("div")),
              (d = (0, o.t)(w)),
              (u = (0, o.G)()),
              k && k.c(),
              (m = (0, o.G)()),
              (p = (0, o.j)("div")),
              (v = (0, o.j)("div")),
              (f = (0, o.G)()),
              j && j.c(),
              (g = (0, o.G)()),
              (0, o.k)(r, "class", "flex items-center relative"),
              (0, o.k)(s, "class", "address-domain svelte-hb2n95"),
              (0, o.k)(l, "class", "account-details svelte-hb2n95"),
              (0, o.k)(
                v,
                "class",
                "elipsis pointer flex items-center justify-center relative svelte-hb2n95",
              ),
              (0, o.k)(p, "class", "elipsis-container svelte-hb2n95"),
              (0, o.H)(p, "active", e[3] === e[14]),
              (0, o.k)(t, "class", "container svelte-hb2n95"),
              (0, o.H)(t, "primary", e[1] && 0 === e[19]),
              (0, o.k)(n, "class", "relative");
          },
          m(e, w) {
            (0, o.b)(e, n, w),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.I)(a, r, null),
              (0, o.m)(r, i),
              y && y.m(r, null),
              (0, o.m)(t, c),
              (0, o.m)(t, l),
              (0, o.m)(l, s),
              (0, o.m)(s, d),
              (0, o.m)(l, u),
              k && k.m(l, null),
              (0, o.m)(t, m),
              (0, o.m)(t, p),
              (0, o.m)(p, v),
              (v.innerHTML = V),
              (0, o.m)(n, f),
              j && j.m(n, null),
              (0, o.m)(n, g),
              (h = !0),
              b ||
                ((x = [
                  (0, o.p)(v, "click", (0, o.J)($)),
                  (0, o.p)(t, "click", C),
                ]),
                (b = !0));
          },
          p(i, c) {
            e = i;
            const s = {};
            2 & c &&
              (s.customBackgroundColor =
                e[1] && 0 === e[19]
                  ? "rgba(24, 206, 102, 0.2)"
                  : "rgba(235, 235, 237, 0.1)"),
              2 & c && (s.border = e[1] && 0 === e[19] ? "green" : "gray"),
              1 & c && (s.icon = e[0].icon),
              a.$set(s),
              e[1] && 0 === e[19]
                ? y
                  ? 2 & c && (0, o.x)(y, 1)
                  : ((y = E()), y.c(), (0, o.x)(y, 1), y.m(r, null))
                : y &&
                  ((0, o.y)(),
                  (0, o.A)(y, 1, 1, () => {
                    y = null;
                  }),
                  (0, o.z)()),
              (!h || 1 & c) &&
                w !==
                  (w =
                    (e[15]
                      ? (0, o.D)(e[15].name)
                      : e[16]
                        ? (0, o.D)(e[16].name)
                        : (0, o.E)(e[14])) + "") &&
                (0, o.v)(d, w),
              e[17]
                ? k
                  ? (k.p(e, c), 1 & c && (0, o.x)(k, 1))
                  : ((k = Z(e)), k.c(), (0, o.x)(k, 1), k.m(l, null))
                : k && (k.d(1), (k = null)),
              (!h || 9 & c) && (0, o.H)(p, "active", e[3] === e[14]),
              (!h || 2 & c) && (0, o.H)(t, "primary", e[1] && 0 === e[19]),
              e[3] === e[14]
                ? j
                  ? (j.p(e, c), 9 & c && (0, o.x)(j, 1))
                  : ((j = K(e)), j.c(), (0, o.x)(j, 1), j.m(n, g))
                : j && (j.d(1), (j = null));
          },
          i(e) {
            h ||
              ((0, o.x)(a.$$.fragment, e),
              (0, o.x)(y),
              (0, o.x)(k),
              (0, o.x)(j),
              (h = !0));
          },
          o(e) {
            (0, o.A)(a.$$.fragment, e), (0, o.A)(y), (h = !1);
          },
          d(e) {
            e && (0, o.d)(n),
              (0, o.K)(a),
              y && y.d(),
              k && k.d(),
              j && j.d(),
              (b = !1),
              (0, o.L)(x);
          },
        };
      }
      function N(e) {
        let n,
          t,
          r = e[0].accounts,
          a = [];
        for (let n = 0; n < r.length; n += 1) a[n] = W(D(e, r, n));
        const i = (e) =>
          (0, o.A)(a[e], 1, 1, () => {
            a[e] = null;
          });
        return {
          c() {
            for (let e = 0; e < a.length; e += 1) a[e].c();
            n = (0, o.e)();
          },
          m(e, r) {
            for (let n = 0; n < a.length; n += 1) a[n] && a[n].m(e, r);
            (0, o.b)(e, n, r), (t = !0);
          },
          p(e, [t]) {
            if (127 & t) {
              let c;
              for (r = e[0].accounts, c = 0; c < r.length; c += 1) {
                const i = D(e, r, c);
                a[c]
                  ? (a[c].p(i, t), (0, o.x)(a[c], 1))
                  : ((a[c] = W(i)),
                    a[c].c(),
                    (0, o.x)(a[c], 1),
                    a[c].m(n.parentNode, n));
              }
              for ((0, o.y)(), c = r.length; c < a.length; c += 1) i(c);
              (0, o.z)();
            }
          },
          i(e) {
            if (!t) {
              for (let e = 0; e < r.length; e += 1) (0, o.x)(a[e]);
              t = !0;
            }
          },
          o(e) {
            a = a.filter(Boolean);
            for (let e = 0; e < a.length; e += 1) (0, o.A)(a[e]);
            t = !1;
          },
          d(e) {
            (0, o.B)(a, e), e && (0, o.d)(n);
          },
        };
      }
      function O(e) {
        const [n] = Object.keys(e);
        return `${e[n].length > 7 ? e[n].slice(0, 7) : e[n]} ${n}`;
      }
      function R(e, n, t) {
        let r;
        (0, o.c)(e, b._, (e) => t(4, (r = e)));
        let { wallet: a } = n,
          { primary: i } = n;
        function c() {
          t(3, (l = ""));
        }
        let l = "";
        async function s(e) {
          try {
            await (0, o.M)(e.provider);
          } catch (n) {
            const { code: t } = n;
            (t !== j.ProviderRpcErrorCode.UNSUPPORTED_METHOD &&
              t !== j.ProviderRpcErrorCode.DOES_NOT_EXIST) ||
              o.N.next({ inProgress: !1, actionRequired: e.label });
          }
        }
        function d() {
          t(2, (o.C.accountCenter.copyAddress = "Copied Successfully"), o.C),
            setTimeout(c, 500),
            setTimeout(() => {
              t(
                2,
                (o.C.accountCenter.copyAddress = "Copy Wallet address"),
                o.C,
              );
            }, 700);
        }
        return (
          (e.$$set = (e) => {
            "wallet" in e && t(0, (a = e.wallet)),
              "primary" in e && t(1, (i = e.primary));
          }),
          [
            a,
            i,
            o.C,
            l,
            r,
            s,
            d,
            c,
            (e) => t(3, (l = l === e ? "" : e)),
            (e) => (0, o.O)(a, e),
            () => {
              t(3, (l = "")), s(a);
            },
            (e) => {
              t(3, (l = "")), (0, o.O)(a, e);
            },
            () => {
              t(3, (l = "")), (0, o.P)({ label: a.label });
            },
            (e, n, t) => {
              (0, o.Q)(e ? e.name : n ? n.name : t).then(() => {
                d();
              });
            },
          ]
        );
      }
      class U extends o.S {
        constructor(e) {
          super(),
            (0, o.i)(
              this,
              e,
              R,
              N,
              o.s,
              { wallet: 0, primary: 1, hideMenu: 7 },
              q,
            );
        }
        get hideMenu() {
          return this.$$.ctx[7];
        }
      }
      var J =
          '\n  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>\n  </svg>\n',
        X =
          '\n  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>\n  </svg>\n',
        Y =
          '<svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" fill="grey"/></svg>',
        Q =
          '<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M6.99998 17.3125C5.05553 16.8264 3.45831 15.6979 2.20831 13.9271C0.958313 12.1562 0.333313 10.2153 0.333313 8.10417V3.14583L6.99998 0.645833L13.6666 3.14583V8.10417C13.6666 10.2153 13.0416 12.1562 11.7916 13.9271C10.5416 15.6979 8.94442 16.8264 6.99998 17.3125ZM5.12498 12.3333H8.87498C9.05553 12.3333 9.20484 12.2743 9.3229 12.1562C9.44095 12.0382 9.49998 11.8889 9.49998 11.7083V8.79167C9.49998 8.61111 9.44095 8.46181 9.3229 8.34375C9.20484 8.22569 9.05553 8.16667 8.87498 8.16667H8.66665V7.33333C8.66665 6.875 8.50345 6.48264 8.17706 6.15625C7.85067 5.82986 7.45831 5.66667 6.99998 5.66667C6.54165 5.66667 6.14928 5.82986 5.8229 6.15625C5.49651 6.48264 5.33331 6.875 5.33331 7.33333V8.16667H5.12498C4.94442 8.16667 4.79512 8.22569 4.67706 8.34375C4.55901 8.46181 4.49998 8.61111 4.49998 8.79167V11.7083C4.49998 11.8889 4.55901 12.0382 4.67706 12.1562C4.79512 12.2743 4.94442 12.3333 5.12498 12.3333ZM5.95831 8.16667V7.33333C5.95831 7.05556 6.06248 6.82292 6.27081 6.63542C6.47915 6.44792 6.7222 6.35417 6.99998 6.35417C7.27776 6.35417 7.52081 6.44792 7.72915 6.63542C7.93748 6.82292 8.04165 7.05556 8.04165 7.33333V8.16667H5.95831Z" fill="#929BED"/>\n</svg>\n';
      function ee(e) {
        (0, o.a)(
          e,
          "svelte-1ubxcdp",
          ".content.svelte-1ubxcdp{padding:1rem;width:300px;font-family:var(--onboard-font-family-normal, var(--font-family-normal));font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:24px}.icon-container.svelte-1ubxcdp{width:3rem;height:3rem;background:var(--onboard-warning-100, var(--warning-100));border-radius:24px;padding:12px;color:var(--onboard-warning-500, var(--warning-500))}h4.svelte-1ubxcdp{margin:1.5rem 0 0.5rem 0;font-weight:600}p.svelte-1ubxcdp{margin:0;font-weight:400}button.svelte-1ubxcdp{margin-top:1.5rem;width:50%;font-weight:600}.right.svelte-1ubxcdp{margin-left:0.5rem;width:60%}",
        );
      }
      function ne(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f,
          g,
          h,
          b,
          x =
            e[2]("modals.confirmDisconnectAll.heading", {
              default: o.C.modals.confirmDisconnectAll.heading,
            }) + "",
          w = e[2]("modals.confirmDisconnectAll.description") + "",
          y =
            e[2]("modals.confirmDisconnectAll.cancel", {
              default: o.C.modals.confirmDisconnectAll.cancel,
            }) + "",
          k =
            e[2]("modals.confirmDisconnectAll.confirm", {
              default: o.C.modals.confirmDisconnectAll.confirm,
            }) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.G)()),
              (a = (0, o.j)("h4")),
              (i = (0, o.t)(x)),
              (c = (0, o.G)()),
              (l = (0, o.j)("p")),
              (s = (0, o.t)(w)),
              (d = (0, o.G)()),
              (u = (0, o.j)("div")),
              (m = (0, o.j)("button")),
              (p = (0, o.t)(y)),
              (v = (0, o.G)()),
              (f = (0, o.j)("button")),
              (g = (0, o.t)(k)),
              (0, o.k)(
                t,
                "class",
                "icon-container flex justify-center items-center svelte-1ubxcdp",
              ),
              (0, o.k)(a, "class", "svelte-1ubxcdp"),
              (0, o.k)(l, "class", "svelte-1ubxcdp"),
              (0, o.k)(
                m,
                "class",
                "button-neutral-solid-b rounded svelte-1ubxcdp",
              ),
              (0, o.k)(
                f,
                "class",
                "right button-neutral-solid rounded svelte-1ubxcdp",
              ),
              (0, o.k)(u, "class", "flex justify-between items-center w-100"),
              (0, o.k)(n, "class", "content svelte-1ubxcdp");
          },
          m(x, w) {
            (0, o.b)(x, n, w),
              (0, o.m)(n, t),
              (t.innerHTML = A),
              (0, o.m)(n, r),
              (0, o.m)(n, a),
              (0, o.m)(a, i),
              (0, o.m)(n, c),
              (0, o.m)(n, l),
              (0, o.m)(l, s),
              (0, o.m)(n, d),
              (0, o.m)(n, u),
              (0, o.m)(u, m),
              (0, o.m)(m, p),
              (0, o.m)(u, v),
              (0, o.m)(u, f),
              (0, o.m)(f, g),
              h ||
                ((b = [
                  (0, o.p)(m, "click", function () {
                    (0, o.Z)(e[1]) && e[1].apply(this, arguments);
                  }),
                  (0, o.p)(f, "click", function () {
                    (0, o.Z)(e[0]) && e[0].apply(this, arguments);
                  }),
                ]),
                (h = !0));
          },
          p(n, t) {
            (e = n),
              4 & t &&
                x !==
                  (x =
                    e[2]("modals.confirmDisconnectAll.heading", {
                      default: o.C.modals.confirmDisconnectAll.heading,
                    }) + "") &&
                (0, o.v)(i, x),
              4 & t &&
                w !==
                  (w = e[2]("modals.confirmDisconnectAll.description") + "") &&
                (0, o.v)(s, w),
              4 & t &&
                y !==
                  (y =
                    e[2]("modals.confirmDisconnectAll.cancel", {
                      default: o.C.modals.confirmDisconnectAll.cancel,
                    }) + "") &&
                (0, o.v)(p, y),
              4 & t &&
                k !==
                  (k =
                    e[2]("modals.confirmDisconnectAll.confirm", {
                      default: o.C.modals.confirmDisconnectAll.confirm,
                    }) + "") &&
                (0, o.v)(g, k);
          },
          d(e) {
            e && (0, o.d)(n), (h = !1), (0, o.L)(b);
          },
        };
      }
      function te(e) {
        let n, t;
        return (
          (n = new o.Y({
            props: {
              close: e[1],
              $$slots: { default: [ne] },
              $$scope: { ctx: e },
            },
          })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, [t]) {
              const o = {};
              2 & t && (o.close = e[1]),
                15 & t && (o.$$scope = { dirty: t, ctx: e }),
                n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function oe(e, n, t) {
        let r;
        (0, o.c)(e, b._, (e) => t(2, (r = e)));
        let { onConfirm: a } = n,
          { onClose: i } = n;
        return (
          (e.$$set = (e) => {
            "onConfirm" in e && t(0, (a = e.onConfirm)),
              "onClose" in e && t(1, (i = e.onClose));
          }),
          [a, i, r]
        );
      }
      class re extends o.S {
        constructor(e) {
          super(),
            (0, o.i)(this, e, oe, te, o.s, { onConfirm: 0, onClose: 1 }, ee);
        }
      }
      function ae(e) {
        (0, o.a)(
          e,
          "svelte-ruodf3",
          ".content.svelte-ruodf3{--background-color:var(--w3o-background-color);--text-color:var(--w3o-text-color);--action-color:var(--w3o-action-color, var(--primary-500));font-size:1rem;line-height:1.5rem;display:flex;flex-flow:column;gap:1.5rem;padding:1rem;max-width:320px;background:var(--background-color);color:var(--text-color)}.icon-container.svelte-ruodf3{position:relative;overflow:hidden;width:3rem;height:3rem;border-radius:24px;padding:0.75rem;background:none}.icon-container.svelte-ruodf3::before{content:'';position:absolute;height:100%;width:100%;opacity:0.2;background:var(--action-color)}.text-container.svelte-ruodf3{display:flex;flex-flow:column;gap:0.5rem;padding:0 0.5rem}.actions-container.svelte-ruodf3{display:flex;flex-flow:row nowrap;gap:1rem}.heading.svelte-ruodf3{font-weight:600}button.svelte-ruodf3{font-weight:600}button.primary.svelte-ruodf3{background:var(--action-color)}",
        );
      }
      function ie(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f,
          g,
          h,
          b,
          x,
          w,
          y,
          k,
          $ =
            e[3]("modals.confirmTransactionProtection.heading", {
              default: o.C.modals.confirmTransactionProtection.heading,
            }) + "",
          C = e[3]("modals.confirmTransactionProtection.description") + "",
          j =
            e[3]("modals.confirmTransactionProtection.link", {
              default: o.C.modals.confirmTransactionProtection.link,
            }) + "",
          z =
            e[3]("modals.confirmTransactionProtection.dismiss", {
              default: o.C.modals.confirmTransactionProtection.dismiss,
            }) + "",
          A =
            e[3]("modals.confirmTransactionProtection.enable", {
              default: o.C.modals.confirmTransactionProtection.enable,
            }) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.G)()),
              (a = (0, o.j)("div")),
              (i = (0, o.j)("div")),
              (c = (0, o.t)($)),
              (l = (0, o.G)()),
              (s = (0, o.j)("div")),
              (d = (0, o.t)(C)),
              (u = (0, o.G)()),
              (m = (0, o.j)("a")),
              (p = (0, o.t)(j)),
              (v = (0, o.G)()),
              (f = (0, o.j)("div")),
              (g = (0, o.j)("button")),
              (h = (0, o.t)(z)),
              (b = (0, o.G)()),
              (x = (0, o.j)("button")),
              (w = (0, o.t)(A)),
              (0, o.k)(
                t,
                "class",
                "icon-container flex justify-center items-center svelte-ruodf3",
              ),
              (0, o.k)(i, "class", "heading svelte-ruodf3"),
              (0, o.k)(m, "href", e[2]),
              (0, o.k)(m, "target", "_blank"),
              (0, o.k)(m, "rel", "noreferrer noopener"),
              (0, o.k)(m, "class", "no-link"),
              (0, o.k)(a, "class", "text-container svelte-ruodf3"),
              (0, o.k)(g, "class", "button-neutral-solid-b svelte-ruodf3"),
              (0, o.k)(
                x,
                "class",
                "button-neutral-solid rounded primary svelte-ruodf3",
              ),
              (0, o.k)(f, "class", "actions-container svelte-ruodf3"),
              (0, o.k)(n, "class", "content svelte-ruodf3");
          },
          m($, C) {
            (0, o.b)($, n, C),
              (0, o.m)(n, t),
              (t.innerHTML = Q),
              (0, o.m)(n, r),
              (0, o.m)(n, a),
              (0, o.m)(a, i),
              (0, o.m)(i, c),
              (0, o.m)(a, l),
              (0, o.m)(a, s),
              (0, o.m)(s, d),
              (0, o.m)(a, u),
              (0, o.m)(a, m),
              (0, o.m)(m, p),
              (0, o.m)(n, v),
              (0, o.m)(n, f),
              (0, o.m)(f, g),
              (0, o.m)(g, h),
              (0, o.m)(f, b),
              (0, o.m)(f, x),
              (0, o.m)(x, w),
              y ||
                ((k = [
                  (0, o.p)(g, "click", function () {
                    (0, o.Z)(e[1]) && e[1].apply(this, arguments);
                  }),
                  (0, o.p)(x, "click", function () {
                    (0, o.Z)(e[0]) && e[0].apply(this, arguments);
                  }),
                ]),
                (y = !0));
          },
          p(n, t) {
            (e = n),
              8 & t &&
                $ !==
                  ($ =
                    e[3]("modals.confirmTransactionProtection.heading", {
                      default: o.C.modals.confirmTransactionProtection.heading,
                    }) + "") &&
                (0, o.v)(c, $),
              8 & t &&
                C !==
                  (C =
                    e[3]("modals.confirmTransactionProtection.description") +
                    "") &&
                (0, o.v)(d, C),
              8 & t &&
                j !==
                  (j =
                    e[3]("modals.confirmTransactionProtection.link", {
                      default: o.C.modals.confirmTransactionProtection.link,
                    }) + "") &&
                (0, o.v)(p, j),
              4 & t && (0, o.k)(m, "href", e[2]),
              8 & t &&
                z !==
                  (z =
                    e[3]("modals.confirmTransactionProtection.dismiss", {
                      default: o.C.modals.confirmTransactionProtection.dismiss,
                    }) + "") &&
                (0, o.v)(h, z),
              8 & t &&
                A !==
                  (A =
                    e[3]("modals.confirmTransactionProtection.enable", {
                      default: o.C.modals.confirmTransactionProtection.enable,
                    }) + "") &&
                (0, o.v)(w, A);
          },
          d(e) {
            e && (0, o.d)(n), (y = !1), (0, o.L)(k);
          },
        };
      }
      function ce(e) {
        let n, t;
        return (
          (n = new o.Y({
            props: {
              close: e[1],
              $$slots: { default: [ie] },
              $$scope: { ctx: e },
            },
          })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, [t]) {
              const o = {};
              2 & t && (o.close = e[1]),
                31 & t && (o.$$scope = { dirty: t, ctx: e }),
                n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function le(e, n, t) {
        let r;
        (0, o.c)(e, b._, (e) => t(3, (r = e)));
        let { onEnable: a } = n,
          { onDismiss: i } = n,
          { infoLink: c } = n;
        return (
          (e.$$set = (e) => {
            "onEnable" in e && t(0, (a = e.onEnable)),
              "onDismiss" in e && t(1, (i = e.onDismiss)),
              "infoLink" in e && t(2, (c = e.infoLink));
          }),
          [a, i, c, r]
        );
      }
      class se extends o.S {
        constructor(e) {
          super(),
            (0, o.i)(
              this,
              e,
              le,
              ce,
              o.s,
              { onEnable: 0, onDismiss: 1, infoLink: 2 },
              ae,
            );
        }
      }
      function de(e) {
        (0, o.a)(
          e,
          "svelte-b848yl",
          ".secondary-token-container.svelte-b848yl.svelte-b848yl{width:100%}table.svelte-b848yl.svelte-b848yl{width:100%}tr.svelte-b848yl.svelte-b848yl{padding:0.25rem 1rem;line-height:1rem;border-bottom:1px solid var(--border-color);display:flex;flex-direction:row;align-items:flex-start;gap:1rem}thead.svelte-b848yl .secondary-token-table-header.svelte-b848yl{text-align:inherit;font-size:var(--onboard-font-size-7, var(--font-size-7))}.token-icon.svelte-b848yl.svelte-b848yl{width:30%;font-weight:700;font-size:var(--onboard-font-size-6, var(--font-size-6));color:var(--text-color)}.icon-name-container.svelte-b848yl.svelte-b848yl{display:flex;flex-direction:row;align-items:flex-start;padding:0px;gap:0.5rem}.icon.svelte-b848yl.svelte-b848yl{width:1rem;height:1rem}img.svelte-b848yl.svelte-b848yl{height:100%;width:100%}.token-balance.svelte-b848yl.svelte-b848yl{width:70%;font-weight:200;font-size:var(--onboard-font-size-6, var(--font-size-6));color:var(--text-color)}",
        );
      }
      function ue(e, n, t) {
        const o = e.slice();
        return (o[1] = n[t]), o;
      }
      function me(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u = e[1].name.toUpperCase() + "",
          m =
            (e[1].balance.length > 7
              ? e[1].balance.slice(0, 7)
              : e[1].balance) + "";
        function p(e, n) {
          return e[1].icon ? ve : pe;
        }
        let v = p(e),
          f = v(e);
        return {
          c() {
            (n = (0, o.j)("tr")),
              (t = (0, o.j)("td")),
              (r = (0, o.j)("div")),
              f.c(),
              (a = (0, o.G)()),
              (i = (0, o.t)(u)),
              (c = (0, o.G)()),
              (l = (0, o.j)("td")),
              (s = (0, o.t)(m)),
              (d = (0, o.G)()),
              (0, o.k)(r, "class", "icon-name-container svelte-b848yl"),
              (0, o.k)(t, "class", "token-icon svelte-b848yl"),
              (0, o.k)(l, "class", "token-balance svelte-b848yl"),
              (0, o.k)(n, "class", "token-row svelte-b848yl");
          },
          m(e, u) {
            (0, o.b)(e, n, u),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              f.m(r, null),
              (0, o.m)(r, a),
              (0, o.m)(r, i),
              (0, o.m)(n, c),
              (0, o.m)(n, l),
              (0, o.m)(l, s),
              (0, o.m)(n, d);
          },
          p(e, n) {
            v === (v = p(e)) && f
              ? f.p(e, n)
              : (f.d(1), (f = v(e)), f && (f.c(), f.m(r, a))),
              1 & n &&
                u !== (u = e[1].name.toUpperCase() + "") &&
                (0, o.v)(i, u),
              1 & n &&
                m !==
                  (m =
                    (e[1].balance.length > 7
                      ? e[1].balance.slice(0, 7)
                      : e[1].balance) + "") &&
                (0, o.v)(s, m);
          },
          d(e) {
            e && (0, o.d)(n), f.d();
          },
        };
      }
      function pe(e) {
        let n;
        return {
          c() {
            (n = (0, o.j)("div")), (0, o.k)(n, "class", "icon svelte-b848yl");
          },
          m(e, t) {
            (0, o.b)(e, n, t);
          },
          p: o.n,
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function ve(e) {
        let n,
          t,
          r = {
            ctx: e,
            current: null,
            token: null,
            hasCatch: !1,
            pending: xe,
            then: ge,
            catch: fe,
            value: 4,
          };
        return (
          (0, o._)((t = e[1].icon), r),
          {
            c() {
              (n = (0, o.e)()), r.block.c();
            },
            m(e, t) {
              (0, o.b)(e, n, t),
                r.block.m(e, (r.anchor = t)),
                (r.mount = () => n.parentNode),
                (r.anchor = n);
            },
            p(n, a) {
              (e = n),
                (r.ctx = e),
                (1 & a && t !== (t = e[1].icon) && (0, o._)(t, r)) ||
                  (0, o.$)(r, e, a);
            },
            d(e) {
              e && (0, o.d)(n), r.block.d(e), (r.token = null), (r = null);
            },
          }
        );
      }
      function fe(e) {
        return { c: o.n, m: o.n, p: o.n, i: o.n, o: o.n, d: o.n };
      }
      function ge(e) {
        let n, t, r;
        function a(e, n) {
          return (
            1 & n && (t = null),
            null == t && (t = !!(0, o.a0)(e[4])),
            t ? be : he
          );
        }
        let i = a(e, -1),
          c = i(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              c.c(),
              (0, o.k)(n, "class", "icon svelte-b848yl");
          },
          m(e, t) {
            (0, o.b)(e, n, t), c.m(n, null);
          },
          p(e, t) {
            i === (i = a(e, t)) && c
              ? c.p(e, t)
              : (c.d(1), (c = i(e)), c && (c.c(), c.m(n, null)));
          },
          i(e) {
            e &&
              (r ||
                (0, o.U)(() => {
                  (r = (0, o.V)(n, o.X, {})), r.start();
                }));
          },
          o: o.n,
          d(e) {
            e && (0, o.d)(n), c.d();
          },
        };
      }
      function he(e) {
        let n, t;
        return {
          c() {
            (n = (0, o.j)("img")),
              (0, o.a1)(n.src, (t = e[4])) || (0, o.k)(n, "src", t),
              (0, o.k)(n, "alt", "logo"),
              (0, o.k)(n, "class", "svelte-b848yl");
          },
          m(e, t) {
            (0, o.b)(e, n, t);
          },
          p(e, r) {
            1 & r && !(0, o.a1)(n.src, (t = e[4])) && (0, o.k)(n, "src", t);
          },
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function be(e) {
        let n,
          t,
          r = e[4] + "";
        return {
          c() {
            (n = new o.a2(!1)), (t = (0, o.e)()), (n.a = t);
          },
          m(e, a) {
            n.m(r, e, a), (0, o.b)(e, t, a);
          },
          p(e, t) {
            1 & t && r !== (r = e[4] + "") && n.p(r);
          },
          d(e) {
            e && (0, o.d)(t), e && n.d();
          },
        };
      }
      function xe(e) {
        return { c: o.n, m: o.n, p: o.n, i: o.n, o: o.n, d: o.n };
      }
      function we(e) {
        let n,
          t = e[1] && e[1].name && e[1].balance && me(e);
        return {
          c() {
            t && t.c(), (n = (0, o.e)());
          },
          m(e, r) {
            t && t.m(e, r), (0, o.b)(e, n, r);
          },
          p(e, o) {
            e[1] && e[1].name && e[1].balance
              ? t
                ? t.p(e, o)
                : ((t = me(e)), t.c(), t.m(n.parentNode, n))
              : t && (t.d(1), (t = null));
          },
          d(e) {
            t && t.d(e), e && (0, o.d)(n);
          },
        };
      }
      function ye(e) {
        let n,
          t,
          r,
          a,
          i,
          c = e[0],
          l = [];
        for (let n = 0; n < c.length; n += 1) l[n] = we(ue(e, c, n));
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("table")),
              (r = (0, o.j)("thead")),
              (r.innerHTML =
                '<tr class="svelte-b848yl"><th colspan="3" class="secondary-token-table-header svelte-b848yl">Token Balances:</th></tr>'),
              (a = (0, o.G)()),
              (i = (0, o.j)("tbody"));
            for (let e = 0; e < l.length; e += 1) l[e].c();
            (0, o.k)(r, "class", "svelte-b848yl"),
              (0, o.k)(
                t,
                "class",
                "balance-change-table table-radius svelte-b848yl",
              ),
              (0, o.k)(n, "class", "secondary-token-container svelte-b848yl");
          },
          m(e, c) {
            (0, o.b)(e, n, c),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.m)(t, a),
              (0, o.m)(t, i);
            for (let e = 0; e < l.length; e += 1) l[e] && l[e].m(i, null);
          },
          p(e, [n]) {
            if (1 & n) {
              let t;
              for (c = e[0], t = 0; t < c.length; t += 1) {
                const o = ue(e, c, t);
                l[t]
                  ? l[t].p(o, n)
                  : ((l[t] = we(o)), l[t].c(), l[t].m(i, null));
              }
              for (; t < l.length; t += 1) l[t].d(1);
              l.length = c.length;
            }
          },
          i: o.n,
          o: o.n,
          d(e) {
            e && (0, o.d)(n), (0, o.B)(l, e);
          },
        };
      }
      function ke(e, n, t) {
        let { secondaryTokens: o } = n;
        return (
          (e.$$set = (e) => {
            "secondaryTokens" in e && t(0, (o = e.secondaryTokens));
          }),
          [o]
        );
      }
      class $e extends o.S {
        constructor(e) {
          super(), (0, o.i)(this, e, ke, ye, o.s, { secondaryTokens: 0 }, de);
        }
      }
      function Ce(e) {
        (0, o.a)(
          e,
          "svelte-177u10y",
          ".outer-container.svelte-177u10y{--background-color:var(--w3o-background-color);--text-color:var(--w3o-text-color);--border-color:var(--w3o-border-color, var(--gray-500));--action-color:var(--w3o-action-color, var(--primary-500));--border-radius:var(--w3o-border-radius, 1rem);--account-center-network-selector-color:var(--text-color, white);width:100%;overflow:hidden;pointer-events:auto;border:1px solid transparent;background:var(\n      --account-center-maximized-upper-background,\n      var(--background-color)\n    );border-color:var(--border-color);border-radius:var(--account-center-border-radius, var(--border-radius))}.wallets-section.svelte-177u10y{width:100%;color:var(--text-color, var(--gray-100));background:var(--background-color, var(--gray-700))}.p5.svelte-177u10y{padding:var(--onboard-spacing-5, var(--spacing-5))}.wallets.svelte-177u10y{width:100%;margin-bottom:0.5rem}.actions.svelte-177u10y{color:var(\n      --account-center-maximized-upper-action-color,\n      var(--action-color)\n    );padding-left:2px}.action-container.svelte-177u10y{padding:0.25rem 12px 0.25rem 0.5rem;border-radius:0.5rem;transition:background-color 150ms ease-in-out}.action-container.svelte-177u10y:hover{background-color:var(\n      --account-center-maximized-upper-action-background-hover,\n      rgba(146, 155, 237, 0.2)\n    )}.plus-icon.svelte-177u10y{width:20px}.arrow-forward.svelte-177u10y{width:20px}.mt.svelte-177u10y{margin-top:0.25rem}.action-text.svelte-177u10y{font-size:var(--onboard-font-size-6, var(--font-size-6));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));margin-left:0.5rem}.background-blue.svelte-177u10y{background:var(\n      --account-center-maximized-network-section-background,\n      var(--onboard-primary-100, var(--primary-100))\n    )}.background-gray.svelte-177u10y{background:var(--onboard-gray-100, var(--gray-100))}.background-yellow.svelte-177u10y{background:var(--onboard-warning-100, var(--warning-100))}.network-container.svelte-177u10y{background:var(--background-color);border-top:1px solid var(--border-color);width:100%;display:flex;flex-direction:column;align-items:flex-start;padding:0.75rem;gap:0.5rem;border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    );color:var(\n      --account-center-maximized-network-text-color,\n      var(--account-center-maximized-network-section, inherit)\n    )}.network-section.svelte-177u10y{flex-direction:row;align-items:flex-start;padding:0px;gap:16px}.network-selector-container.svelte-177u10y{width:100%}.protect.svelte-177u10y{flex-direction:row;padding:0.25rem 0.375rem 0;gap:0.375rem;width:100%}.shield.svelte-177u10y{width:20px;height:20px;display:flex;justify-content:center}.protect-text.svelte-177u10y{font-size:var(--onboard-font-size-6, var(--font-size-6));color:var(\n      --account-center-maximized-upper-action-color,\n      var(--action-color)\n    );line-height:1.75rem;display:flex;align-items:center}.network-selector-container.svelte-177u10y{margin-left:1rem;width:100%}.network-selector-label.svelte-177u10y{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3))}.app-info-container.svelte-177u10y{color:var(--text-color, var(--gray-700));background:var(\n      --account-center-maximized-info-section-background-color,\n      var(\n        --account-center-maximized-info-section,\n        var(--background-color, #fff)\n      )\n    );border-top:1px solid var(--border-color);border-radius:var(--account-center-border-radius, inherit);display:flex;flex-direction:column;align-items:flex-start;padding:0px}.app-info-header.svelte-177u10y{width:100%;flex-direction:column;align-items:flex-start;padding:0.75rem;gap:0.5rem;border-bottom:1px solid var(--border-color)}.app-icon-name.svelte-177u10y{display:flex;align-items:center;flex-direction:row;gap:0.75rem}.app-name.svelte-177u10y{font-size:1rem;font-weight:600;line-height:1rem;margin-bottom:0.25rem;color:var(--account-center-maximized-app-name-color, inherit)}.app-description.svelte-177u10y{margin:0;font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));color:var(--account-center-maximized-app-info-color, inherit);display:flex;flex-direction:row;align-items:flex-start;padding:0px 0.25rem;gap:1rem}.app-info.svelte-177u10y{width:100%;font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));color:var(--account-center-maximized-app-info-color, inherit);border-bottom:1px solid var(--border-color);display:flex;flex-direction:column;align-items:flex-start;padding:0.5rem 1rem;gap:0.25rem}.app-info-heading.svelte-177u10y{font-weight:700;color:var(--account-center-maximized-app-info-color, inherit)}.w100.svelte-177u10y{width:100%}a.svelte-177u10y{font-weight:700}.powered-by-container.svelte-177u10y{color:var(--text-color);padding:0.75rem}",
        );
      }
      function je(e, n, t) {
        const o = e.slice();
        return (o[29] = n[t]), (o[31] = t), o;
      }
      function ze(e) {
        let n, t;
        return (
          (n = new re({ props: { onClose: e[22], onConfirm: e[13] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, t) {
              const o = {};
              4 & t[0] && (o.onClose = e[22]), n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Ae(e) {
        let n, t;
        return (
          (n = new se({
            props: {
              onDismiss: e[23],
              onEnable: e[24],
              infoLink: e[9].transactionProtectionInfoLink || o.a5,
            },
          })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, t) {
              const r = {};
              16 & t[0] && (r.onDismiss = e[23]),
                512 & t[0] &&
                  (r.infoLink = e[9].transactionProtectionInfoLink || o.a5),
                n.$set(r);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Ge(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f,
          g,
          h,
          b,
          x,
          w,
          y,
          k,
          $,
          C,
          j,
          z,
          G,
          I,
          T,
          _,
          F,
          H = [],
          L = new Map(),
          M =
            e[10]("accountCenter.currentNetwork", {
              default: o.C.accountCenter.currentNetwork,
            }) + "",
          P = e[1];
        const V = (e) => e[29].label;
        for (let n = 0; n < P.length; n += 1) {
          let t = je(e, P, n),
            o = V(t);
          L.set(o, (H[n] = Ie(o, t)));
        }
        let q =
          "desktop" === e[17].type &&
          (function (e) {
            let n,
              t,
              r,
              a,
              i,
              c,
              l,
              s,
              d,
              u,
              m,
              p,
              v,
              f =
                e[10]("accountCenter.connectAnotherWallet", {
                  default: o.C.accountCenter.connectAnotherWallet,
                }) + "",
              g =
                e[10]("accountCenter.disconnectAllWallets", {
                  default: o.C.accountCenter.disconnectAllWallets,
                }) + "";
            return {
              c() {
                (n = (0, o.j)("div")),
                  (t = (0, o.j)("div")),
                  (r = (0, o.G)()),
                  (a = (0, o.j)("span")),
                  (i = (0, o.t)(f)),
                  (c = (0, o.G)()),
                  (l = (0, o.j)("div")),
                  (s = (0, o.j)("div")),
                  (d = (0, o.G)()),
                  (u = (0, o.j)("span")),
                  (m = (0, o.t)(g)),
                  (0, o.k)(
                    t,
                    "class",
                    "plus-icon flex items-center justify-center svelte-177u10y",
                  ),
                  (0, o.k)(a, "class", "action-text svelte-177u10y"),
                  (0, o.k)(
                    n,
                    "class",
                    "action-container flex items-center pointer svelte-177u10y",
                  ),
                  (0, o.k)(
                    s,
                    "class",
                    "arrow-forward flex items-center justify-center svelte-177u10y",
                  ),
                  (0, o.k)(u, "class", "action-text svelte-177u10y"),
                  (0, o.k)(
                    l,
                    "class",
                    "action-container flex items-center mt pointer svelte-177u10y",
                  );
              },
              m(f, g) {
                (0, o.b)(f, n, g),
                  (0, o.m)(n, t),
                  (t.innerHTML = J),
                  (0, o.m)(n, r),
                  (0, o.m)(n, a),
                  (0, o.m)(a, i),
                  (0, o.b)(f, c, g),
                  (0, o.b)(f, l, g),
                  (0, o.m)(l, s),
                  (s.innerHTML = X),
                  (0, o.m)(l, d),
                  (0, o.m)(l, u),
                  (0, o.m)(u, m),
                  p ||
                    ((v = [
                      (0, o.p)(n, "click", e[26]),
                      (0, o.p)(l, "click", e[27]),
                    ]),
                    (p = !0));
              },
              p(e, n) {
                1024 & n[0] &&
                  f !==
                    (f =
                      e[10]("accountCenter.connectAnotherWallet", {
                        default: o.C.accountCenter.connectAnotherWallet,
                      }) + "") &&
                  (0, o.v)(i, f),
                  1024 & n[0] &&
                    g !==
                      (g =
                        e[10]("accountCenter.disconnectAllWallets", {
                          default: o.C.accountCenter.disconnectAllWallets,
                        }) + "") &&
                    (0, o.v)(m, g);
              },
              d(e) {
                e && (0, o.d)(n),
                  e && (0, o.d)(c),
                  e && (0, o.d)(l),
                  (p = !1),
                  (0, o.L)(v);
              },
            };
          })(e);
        m = new o.W({
          props: {
            size: 32,
            padding: 4,
            background: "custom",
            color: e[5] ? (e[5].icon ? void 0 : "#EFF1FC") : "#FFAF00",
            customBackgroundColor: e[5]
              ? e[5].color || (e[7] && e[7].color) || o.a6.color
              : "#FFE7B3",
            border: "transparent",
            radius: 8,
            icon: e[5] ? e[5].icon || (e[7] && e[7].icon) || o.a6.icon : A,
          },
        });
        let D = e[5] && Te();
        w = new S({
          props: {
            chains: e[14],
            colorVar: "--account-center-maximized-network-selector-color",
            bold: !0,
            selectIcon: Y,
            parentCSSId: "maximized_ac",
          },
        });
        let E =
            !e[9].hideTransactionProtectionBtn &&
            (e[6] || e[5]?.protectedRpcUrl) &&
            _e(e),
          Z = e[11] && Fe(e),
          K = e[8] && e[8].length && Pe(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.j)("div")),
              (a = (0, o.j)("div"));
            for (let e = 0; e < H.length; e += 1) H[e].c();
            (i = (0, o.G)()),
              (c = (0, o.j)("div")),
              q && q.c(),
              (l = (0, o.G)()),
              (s = (0, o.j)("div")),
              (d = (0, o.j)("div")),
              (u = (0, o.j)("div")),
              (0, o.F)(m.$$.fragment),
              (p = (0, o.G)()),
              D && D.c(),
              (v = (0, o.G)()),
              (f = (0, o.j)("div")),
              (g = (0, o.j)("div")),
              (h = (0, o.t)(M)),
              (b = (0, o.G)()),
              (x = (0, o.j)("div")),
              (0, o.F)(w.$$.fragment),
              (y = (0, o.G)()),
              E && E.c(),
              (k = (0, o.G)()),
              ($ = (0, o.j)("div")),
              Z && Z.c(),
              (C = (0, o.G)()),
              K && K.c(),
              (j = (0, o.G)()),
              (z = (0, o.j)("div")),
              (G = (0, o.j)("a")),
              (0, o.k)(a, "class", "wallets svelte-177u10y"),
              (0, o.k)(
                c,
                "class",
                "actions flex flex-column items-start svelte-177u10y",
              ),
              (0, o.k)(r, "class", "p5 svelte-177u10y"),
              (0, o.k)(u, "class", "relative flex"),
              (0, o.k)(g, "class", "network-selector-label svelte-177u10y"),
              (0, o.k)(x, "class", "flex items-center"),
              (0, o.T)(x, "width", "100%"),
              (0, o.k)(f, "class", "network-selector-container svelte-177u10y"),
              (0, o.k)(
                d,
                "class",
                "network-section flex items-center svelte-177u10y",
              ),
              (0, o.k)(s, "class", "network-container svelte-177u10y"),
              (0, o.H)(s, "background-blue", (e[5] && e[5].icon) || e[7]),
              (0, o.H)(s, "background-yellow", !e[5]),
              (0, o.H)(s, "background-gray", e[5] && !e[7]),
              (0, o.k)(G, "href", "https://blocknative.com"),
              (0, o.k)(G, "target", "_blank"),
              (0, o.k)(G, "rel", "noopener noreferrer"),
              (0, o.k)(
                G,
                "class",
                "flex justify-center items-center powered-by-container svelte-177u10y",
              ),
              (0, o.k)(z, "class", "w100 svelte-177u10y"),
              (0, o.k)($, "class", "app-info-container svelte-177u10y"),
              (0, o.k)(t, "class", "wallets-section svelte-177u10y"),
              (0, o.k)(n, "class", "outer-container svelte-177u10y");
          },
          m(A, I) {
            (0, o.b)(A, n, I), (0, o.m)(n, t), (0, o.m)(t, r), (0, o.m)(r, a);
            for (let e = 0; e < H.length; e += 1) H[e] && H[e].m(a, null);
            (0, o.m)(r, i),
              (0, o.m)(r, c),
              q && q.m(c, null),
              (0, o.m)(t, l),
              (0, o.m)(t, s),
              (0, o.m)(s, d),
              (0, o.m)(d, u),
              (0, o.I)(m, u, null),
              (0, o.m)(u, p),
              D && D.m(u, null),
              (0, o.m)(d, v),
              (0, o.m)(d, f),
              (0, o.m)(f, g),
              (0, o.m)(g, h),
              (0, o.m)(f, b),
              (0, o.m)(f, x),
              (0, o.I)(w, x, null),
              (0, o.m)(s, y),
              E && E.m(s, null),
              (0, o.m)(t, k),
              (0, o.m)(t, $),
              Z && Z.m($, null),
              (0, o.m)($, C),
              K && K.m($, null),
              (0, o.m)($, j),
              (0, o.m)($, z),
              (0, o.m)(z, G),
              (G.innerHTML = o.a7),
              (T = !0),
              _ ||
                ((F = [
                  (0, o.p)(x, "click", e[21]),
                  (0, o.p)(
                    n,
                    "click",
                    (0, o.J)(function () {
                      (0, o.Z)(e[3]) && e[3].apply(this, arguments);
                    }),
                  ),
                ]),
                (_ = !0));
          },
          p(n, t) {
            (e = n),
              10 & t[0] &&
                ((P = e[1]),
                (0, o.y)(),
                (H = (0, o.u)(H, t, V, 1, e, P, L, a, o.a8, Ie, null, je)),
                (0, o.z)()),
              "desktop" === e[17].type && q.p(e, t);
            const r = {};
            32 & t[0] &&
              (r.color = e[5] ? (e[5].icon ? void 0 : "#EFF1FC") : "#FFAF00"),
              160 & t[0] &&
                (r.customBackgroundColor = e[5]
                  ? e[5].color || (e[7] && e[7].color) || o.a6.color
                  : "#FFE7B3"),
              160 & t[0] &&
                (r.icon = e[5]
                  ? e[5].icon || (e[7] && e[7].icon) || o.a6.icon
                  : A),
              m.$set(r),
              e[5]
                ? D
                  ? 32 & t[0] && (0, o.x)(D, 1)
                  : ((D = Te()), D.c(), (0, o.x)(D, 1), D.m(u, null))
                : D &&
                  ((0, o.y)(),
                  (0, o.A)(D, 1, 1, () => {
                    D = null;
                  }),
                  (0, o.z)()),
              (!T || 1024 & t[0]) &&
                M !==
                  (M =
                    e[10]("accountCenter.currentNetwork", {
                      default: o.C.accountCenter.currentNetwork,
                    }) + "") &&
                (0, o.v)(h, M),
              e[9].hideTransactionProtectionBtn ||
              (!e[6] && !e[5]?.protectedRpcUrl)
                ? E && (E.d(1), (E = null))
                : E
                  ? E.p(e, t)
                  : ((E = _e(e)), E.c(), E.m(s, null)),
              (!T || 160 & t[0]) &&
                (0, o.H)(s, "background-blue", (e[5] && e[5].icon) || e[7]),
              (!T || 32 & t[0]) && (0, o.H)(s, "background-yellow", !e[5]),
              (!T || 160 & t[0]) &&
                (0, o.H)(s, "background-gray", e[5] && !e[7]),
              e[11]
                ? Z
                  ? (Z.p(e, t), 2048 & t[0] && (0, o.x)(Z, 1))
                  : ((Z = Fe(e)), Z.c(), (0, o.x)(Z, 1), Z.m($, C))
                : Z &&
                  ((0, o.y)(),
                  (0, o.A)(Z, 1, 1, () => {
                    Z = null;
                  }),
                  (0, o.z)()),
              e[8] && e[8].length
                ? K
                  ? (K.p(e, t), 256 & t[0] && (0, o.x)(K, 1))
                  : ((K = Pe(e)), K.c(), (0, o.x)(K, 1), K.m($, j))
                : K &&
                  ((0, o.y)(),
                  (0, o.A)(K, 1, 1, () => {
                    K = null;
                  }),
                  (0, o.z)());
          },
          i(t) {
            if (!T) {
              for (let e = 0; e < P.length; e += 1) (0, o.x)(H[e]);
              (0, o.x)(m.$$.fragment, t),
                (0, o.x)(D),
                (0, o.x)(w.$$.fragment, t),
                (0, o.x)(Z),
                (0, o.x)(K),
                t &&
                  (0, o.U)(() => {
                    T &&
                      (I ||
                        (I = (0, o.a9)(
                          n,
                          o.ab,
                          {
                            duration: 600,
                            y: e[16].includes("bottom") ? 56 : -76,
                            easing: o.aa,
                            opacity: 0,
                          },
                          !0,
                        )),
                      I.run(1));
                  }),
                (T = !0);
            }
          },
          o(t) {
            for (let e = 0; e < H.length; e += 1) (0, o.A)(H[e]);
            (0, o.A)(m.$$.fragment, t),
              (0, o.A)(D),
              (0, o.A)(w.$$.fragment, t),
              (0, o.A)(Z),
              (0, o.A)(K),
              t &&
                (I ||
                  (I = (0, o.a9)(
                    n,
                    o.ab,
                    {
                      duration: 600,
                      y: e[16].includes("bottom") ? 56 : -76,
                      easing: o.aa,
                      opacity: 0,
                    },
                    !1,
                  )),
                I.run(0)),
              (T = !1);
          },
          d(e) {
            e && (0, o.d)(n);
            for (let e = 0; e < H.length; e += 1) H[e].d();
            q && q.d(),
              (0, o.K)(m),
              D && D.d(),
              (0, o.K)(w),
              E && E.d(),
              Z && Z.d(),
              K && K.d(),
              e && I && I.end(),
              (_ = !1),
              (0, o.L)(F);
          },
        };
      }
      function Ie(e, n) {
        let t, r, a, i;
        function c(e) {
          n[25](e);
        }
        let l = { wallet: n[29], primary: 0 === n[31] };
        return (
          void 0 !== n[3] && (l.hideMenu = n[3]),
          (r = new U({ props: l })),
          o.g.push(() => (0, o.ac)(r, "hideMenu", c)),
          {
            key: e,
            first: null,
            c() {
              (t = (0, o.e)()), (0, o.F)(r.$$.fragment), (this.first = t);
            },
            m(e, n) {
              (0, o.b)(e, t, n), (0, o.I)(r, e, n), (i = !0);
            },
            p(e, t) {
              n = e;
              const i = {};
              2 & t[0] && (i.wallet = n[29]),
                2 & t[0] && (i.primary = 0 === n[31]),
                !a &&
                  8 & t[0] &&
                  ((a = !0), (i.hideMenu = n[3]), (0, o.ad)(() => (a = !1))),
                r.$set(i);
            },
            i(e) {
              i || ((0, o.x)(r.$$.fragment, e), (i = !0));
            },
            o(e) {
              (0, o.A)(r.$$.fragment, e), (i = !1);
            },
            d(e) {
              e && (0, o.d)(t), (0, o.K)(r, e);
            },
          }
        );
      }
      function Te(e) {
        let n, t, r;
        return (
          (t = new o.R({ props: { size: 14 } })),
          {
            c() {
              (n = (0, o.j)("div")),
                (0, o.F)(t.$$.fragment),
                (0, o.T)(n, "right", "-5px"),
                (0, o.T)(n, "bottom", "-5px"),
                (0, o.k)(n, "class", "drop-shadow absolute");
            },
            m(e, a) {
              (0, o.b)(e, n, a), (0, o.I)(t, n, null), (r = !0);
            },
            i(e) {
              r || ((0, o.x)(t.$$.fragment, e), (r = !0));
            },
            o(e) {
              (0, o.A)(t.$$.fragment, e), (r = !1);
            },
            d(e) {
              e && (0, o.d)(n), (0, o.K)(t);
            },
          }
        );
      }
      function _e(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s =
            e[10]("accountCenter.enableTransactionProtection", {
              default: o.C.accountCenter.enableTransactionProtection,
            }) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.G)()),
              (a = (0, o.j)("span")),
              (i = (0, o.t)(s)),
              (0, o.k)(t, "class", "shield svelte-177u10y"),
              (0, o.k)(a, "class", "protect-text svelte-177u10y"),
              (0, o.k)(
                n,
                "class",
                "protect action-container flex items-center pointer svelte-177u10y",
              );
          },
          m(s, d) {
            (0, o.b)(s, n, d),
              (0, o.m)(n, t),
              (t.innerHTML = Q),
              (0, o.m)(n, r),
              (0, o.m)(n, a),
              (0, o.m)(a, i),
              c || ((l = (0, o.p)(n, "click", e[28])), (c = !0));
          },
          p(e, n) {
            1024 & n[0] &&
              s !==
                (s =
                  e[10]("accountCenter.enableTransactionProtection", {
                    default: o.C.accountCenter.enableTransactionProtection,
                  }) + "") &&
              (0, o.v)(i, s);
          },
          d(e) {
            e && (0, o.d)(n), (c = !1), l();
          },
        };
      }
      function Fe(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v = ((e[11] && e[11].name) || "App Name") + "",
          f =
            ((e[11] && e[11].description) ||
              "This app has not added a description.") + "";
        r = new o.W({
          props: {
            size: 32,
            padding: 4,
            background: "white",
            border: "black",
            radius: 8,
            icon: (e[11] && e[11].icon) || o.ae,
          },
        });
        let g = (e[11].gettingStartedGuide || e[11].explore) && He(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (0, o.F)(r.$$.fragment),
              (a = (0, o.G)()),
              (i = (0, o.j)("div")),
              (c = (0, o.t)(v)),
              (l = (0, o.G)()),
              (s = (0, o.j)("div")),
              (d = (0, o.t)(f)),
              (u = (0, o.G)()),
              g && g.c(),
              (m = (0, o.e)()),
              (0, o.k)(i, "class", "app-name svelte-177u10y"),
              (0, o.k)(
                t,
                "class",
                "relative flex app-icon-name svelte-177u10y",
              ),
              (0, o.k)(s, "class", "app-description svelte-177u10y"),
              (0, o.k)(
                n,
                "class",
                "flex items-start app-info-header svelte-177u10y",
              );
          },
          m(e, v) {
            (0, o.b)(e, n, v),
              (0, o.m)(n, t),
              (0, o.I)(r, t, null),
              (0, o.m)(t, a),
              (0, o.m)(t, i),
              (0, o.m)(i, c),
              (0, o.m)(n, l),
              (0, o.m)(n, s),
              (0, o.m)(s, d),
              (0, o.b)(e, u, v),
              g && g.m(e, v),
              (0, o.b)(e, m, v),
              (p = !0);
          },
          p(e, n) {
            const t = {};
            2048 & n[0] && (t.icon = (e[11] && e[11].icon) || o.ae),
              r.$set(t),
              (!p || 2048 & n[0]) &&
                v !== (v = ((e[11] && e[11].name) || "App Name") + "") &&
                (0, o.v)(c, v),
              (!p || 2048 & n[0]) &&
                f !==
                  (f =
                    ((e[11] && e[11].description) ||
                      "This app has not added a description.") + "") &&
                (0, o.v)(d, f),
              e[11].gettingStartedGuide || e[11].explore
                ? g
                  ? g.p(e, n)
                  : ((g = He(e)), g.c(), g.m(m.parentNode, m))
                : g && (g.d(1), (g = null));
          },
          i(e) {
            p || ((0, o.x)(r.$$.fragment, e), (p = !0));
          },
          o(e) {
            (0, o.A)(r.$$.fragment, e), (p = !1);
          },
          d(e) {
            e && (0, o.d)(n),
              (0, o.K)(r),
              e && (0, o.d)(u),
              g && g.d(e),
              e && (0, o.d)(m);
          },
        };
      }
      function He(e) {
        let n,
          t,
          r,
          a,
          i,
          c =
            e[10]("accountCenter.appInfo", {
              default: o.C.accountCenter.appInfo,
            }) + "",
          l = e[11].gettingStartedGuide && Le(e),
          s = e[11].explore && Me(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.t)(c)),
              (a = (0, o.G)()),
              l && l.c(),
              (i = (0, o.G)()),
              s && s.c(),
              (0, o.k)(t, "class", "app-info-heading svelte-177u10y"),
              (0, o.k)(n, "class", "app-info svelte-177u10y");
          },
          m(e, c) {
            (0, o.b)(e, n, c),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.m)(n, a),
              l && l.m(n, null),
              (0, o.m)(n, i),
              s && s.m(n, null);
          },
          p(e, t) {
            1024 & t[0] &&
              c !==
                (c =
                  e[10]("accountCenter.appInfo", {
                    default: o.C.accountCenter.appInfo,
                  }) + "") &&
              (0, o.v)(r, c),
              e[11].gettingStartedGuide
                ? l
                  ? l.p(e, t)
                  : ((l = Le(e)), l.c(), l.m(n, i))
                : l && (l.d(1), (l = null)),
              e[11].explore
                ? s
                  ? s.p(e, t)
                  : ((s = Me(e)), s.c(), s.m(n, null))
                : s && (s.d(1), (s = null));
          },
          d(e) {
            e && (0, o.d)(n), l && l.d(), s && s.d();
          },
        };
      }
      function Le(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s =
            e[10]("accountCenter.learnMore", {
              default: o.C.accountCenter.learnMore,
            }) + "",
          d =
            e[10]("accountCenter.gettingStartedGuide", {
              default: o.C.accountCenter.gettingStartedGuide,
            }) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.t)(s)),
              (a = (0, o.G)()),
              (i = (0, o.j)("a")),
              (c = (0, o.t)(d)),
              (0, o.k)(i, "href", (l = e[11].gettingStartedGuide)),
              (0, o.k)(i, "target", "_blank"),
              (0, o.k)(i, "rel", "noreferrer noopener"),
              (0, o.k)(i, "class", "svelte-177u10y"),
              (0, o.k)(
                n,
                "class",
                "flex justify-between items-center w100 svelte-177u10y",
              );
          },
          m(e, l) {
            (0, o.b)(e, n, l),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.m)(n, a),
              (0, o.m)(n, i),
              (0, o.m)(i, c);
          },
          p(e, n) {
            1024 & n[0] &&
              s !==
                (s =
                  e[10]("accountCenter.learnMore", {
                    default: o.C.accountCenter.learnMore,
                  }) + "") &&
              (0, o.v)(r, s),
              1024 & n[0] &&
                d !==
                  (d =
                    e[10]("accountCenter.gettingStartedGuide", {
                      default: o.C.accountCenter.gettingStartedGuide,
                    }) + "") &&
                (0, o.v)(c, d),
              2048 & n[0] &&
                l !== (l = e[11].gettingStartedGuide) &&
                (0, o.k)(i, "href", l);
          },
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function Me(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s =
            e[10]("accountCenter.smartContracts", {
              default: o.C.accountCenter.smartContracts,
            }) + "",
          d =
            e[10]("accountCenter.explore", {
              default: o.C.accountCenter.explore,
            }) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.j)("div")),
              (r = (0, o.t)(s)),
              (a = (0, o.G)()),
              (i = (0, o.j)("a")),
              (c = (0, o.t)(d)),
              (0, o.k)(i, "href", (l = e[11].explore)),
              (0, o.k)(i, "target", "_blank"),
              (0, o.k)(i, "rel", "noreferrer noopener"),
              (0, o.k)(i, "class", "svelte-177u10y"),
              (0, o.k)(
                n,
                "class",
                "flex justify-between items-center w100 svelte-177u10y",
              );
          },
          m(e, l) {
            (0, o.b)(e, n, l),
              (0, o.m)(n, t),
              (0, o.m)(t, r),
              (0, o.m)(n, a),
              (0, o.m)(n, i),
              (0, o.m)(i, c);
          },
          p(e, n) {
            1024 & n[0] &&
              s !==
                (s =
                  e[10]("accountCenter.smartContracts", {
                    default: o.C.accountCenter.smartContracts,
                  }) + "") &&
              (0, o.v)(r, s),
              1024 & n[0] &&
                d !==
                  (d =
                    e[10]("accountCenter.explore", {
                      default: o.C.accountCenter.explore,
                    }) + "") &&
                (0, o.v)(c, d),
              2048 & n[0] &&
                l !== (l = e[11].explore) &&
                (0, o.k)(i, "href", l);
          },
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function Pe(e) {
        let n, t;
        return (
          (n = new $e({ props: { secondaryTokens: e[8] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, t) {
              const o = {};
              256 & t[0] && (o.secondaryTokens = e[8]), n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Se(e) {
        let n,
          t,
          r,
          a,
          i = e[2] && ze(e),
          c = e[4] && Ae(e),
          l = e[0] && Ge(e);
        return {
          c() {
            i && i.c(),
              (n = (0, o.G)()),
              c && c.c(),
              (t = (0, o.G)()),
              l && l.c(),
              (r = (0, o.e)());
          },
          m(e, s) {
            i && i.m(e, s),
              (0, o.b)(e, n, s),
              c && c.m(e, s),
              (0, o.b)(e, t, s),
              l && l.m(e, s),
              (0, o.b)(e, r, s),
              (a = !0);
          },
          p(e, a) {
            e[2]
              ? i
                ? (i.p(e, a), 4 & a[0] && (0, o.x)(i, 1))
                : ((i = ze(e)), i.c(), (0, o.x)(i, 1), i.m(n.parentNode, n))
              : i &&
                ((0, o.y)(),
                (0, o.A)(i, 1, 1, () => {
                  i = null;
                }),
                (0, o.z)()),
              e[4]
                ? c
                  ? (c.p(e, a), 16 & a[0] && (0, o.x)(c, 1))
                  : ((c = Ae(e)), c.c(), (0, o.x)(c, 1), c.m(t.parentNode, t))
                : c &&
                  ((0, o.y)(),
                  (0, o.A)(c, 1, 1, () => {
                    c = null;
                  }),
                  (0, o.z)()),
              e[0]
                ? l
                  ? (l.p(e, a), 1 & a[0] && (0, o.x)(l, 1))
                  : ((l = Ge(e)), l.c(), (0, o.x)(l, 1), l.m(r.parentNode, r))
                : l &&
                  ((0, o.y)(),
                  (0, o.A)(l, 1, 1, () => {
                    l = null;
                  }),
                  (0, o.z)());
          },
          i(e) {
            a || ((0, o.x)(i), (0, o.x)(c), (0, o.x)(l), (a = !0));
          },
          o(e) {
            (0, o.A)(i), (0, o.A)(c), (0, o.A)(l), (a = !1);
          },
          d(e) {
            i && i.d(e),
              e && (0, o.d)(n),
              c && c.d(e),
              e && (0, o.d)(t),
              l && l.d(e),
              e && (0, o.d)(r);
          },
        };
      }
      function Ve(e, n, t) {
        let r, a, i, c, l, s, d, u, m, p;
        (0, o.c)(e, o.w, (e) => t(1, (d = e))),
          (0, o.c)(e, b._, (e) => t(10, (m = e)));
        let { expanded: v } = n;
        const f = o.a3
          .select("accountCenter")
          .pipe((0, g.O)(o.a3.get().accountCenter), (0, h.d)(1));
        (0, o.c)(e, f, (e) => t(9, (u = e)));
        const { chains: x } = o.a3.get();
        let w,
          y = !1,
          k = !1;
        const $ = o.a3
          .select("appMetadata")
          .pipe((0, g.O)(o.a3.get().appMetadata), (0, h.d)(1));
        (0, o.c)(e, $, (e) => t(11, (p = e)));
        const { position: C } = o.a3.get().accountCenter,
          { device: j } = o.af,
          z = async () => {
            try {
              await (0, o.ag)(r.provider, c, c?.protectedRpcUrl || o.ah),
                t(4, (k = !1));
            } catch (e) {
              const { code: n } = e;
              console.log(e, n);
            }
          };
        return (
          (e.$$set = (e) => {
            "expanded" in e && t(0, (v = e.expanded));
          }),
          (e.$$.update = () => {
            2 & e.$$.dirty[0] && t(19, ([r] = d), r),
              524288 & e.$$.dirty[0] && t(20, ([a] = r ? r.chains : []), a),
              524288 & e.$$.dirty[0] &&
                t(
                  8,
                  (i = r && r.accounts.length && r.accounts[0].secondaryTokens),
                ),
              1048576 & e.$$.dirty[0] &&
                t(
                  5,
                  (c = x.find(
                    ({ id: e, namespace: n }) =>
                      !!a && e === a.id && n === a.namespace,
                  )),
                ),
              1048576 & e.$$.dirty[0] && t(7, (l = (0, o.a4)(a && a.id))),
              1048576 & e.$$.dirty[0] && t(6, (s = a && "0x1" === a.id));
          }),
          [
            v,
            d,
            y,
            w,
            k,
            c,
            s,
            l,
            i,
            u,
            m,
            p,
            f,
            function () {
              d.forEach(({ label: e }) => (0, o.P)({ label: e }));
            },
            x,
            $,
            C,
            j,
            z,
            r,
            a,
            function (n) {
              o.ai.call(this, e, n);
            },
            () => t(2, (y = !1)),
            () => t(4, (k = !1)),
            () => z(),
            function (e) {
              (w = e), t(3, w);
            },
            () => (0, o.aj)(),
            () => t(2, (y = !0)),
            () => t(4, (k = !0)),
          ]
        );
      }
      class qe extends o.S {
        constructor(e) {
          super(),
            (0, o.i)(this, e, Ve, Se, o.s, { expanded: 0 }, Ce, [-1, -1]);
        }
      }
      function De(e) {
        (0, o.a)(
          e,
          "svelte-1xsvwqj",
          ".ac-trigger.svelte-1xsvwqj{--background-color:var(\n      --account-center-minimized-background,\n      var(--w3o-background-color, white)\n    );--text-color:var(--w3o-text-color, var(--gray-700));--border-color:var(\n      --account-center-border,\n      var(--w3o-border-color, var(--onboard-gray-200, var(--gray-200)))\n    );--border-radius:var(\n      --account-center-border-radius,\n      var(--w3o-border-radius, 1rem)\n    );cursor:pointer;pointer-events:auto;width:100%;padding:0.5rem;border:1px solid;background:var(--background-color);color:var(--text-color);border-color:var(--border-color);border-radius:var(--border-radius);box-shadow:var(\n      --account-center-box-shadow,\n      var(--onboard-shadow-3, var(--shadow-3))\n    );z-index:var(--account-center-z-index, 1)}.inner-row.svelte-1xsvwqj{display:flex;flex-flow:row nowrap;align-items:center;gap:0.5rem;padding:0 0.25rem}.wallet-info.svelte-1xsvwqj{display:flex;flex:1;flex-flow:column;height:2.5rem;overflow:hidden}.address.svelte-1xsvwqj{font-weight:600;line-height:1.25rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--account-center-minimized-address-color, inherit)}.balance.svelte-1xsvwqj{font-weight:400;line-height:1.25rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;opacity:0.6;color:var(--account-center-minimized-balance-color, inherit)}.chain-icon-container.svelte-1xsvwqj{margin-right:4px}.container.svelte-1xsvwqj{border:1px solid transparent;border-radius:16px;padding:1px;transition:border-color 250ms ease-in-out, backround 250ms ease-in-out;max-width:128px;cursor:default}.drop-shadow.svelte-1xsvwqj{filter:drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.2))}",
        );
      }
      function Ee(e) {
        let n,
          t,
          r,
          a,
          i,
          c = (e[5].length > 7 ? e[5].slice(0, 7) : e[5]) + "";
        return {
          c() {
            (n = (0, o.j)("div")),
              (t = (0, o.t)(c)),
              (r = (0, o.G)()),
              (a = (0, o.t)(e[2])),
              (0, o.k)(n, "class", "balance svelte-1xsvwqj");
          },
          m(e, i) {
            (0, o.b)(e, n, i), (0, o.m)(n, t), (0, o.m)(n, r), (0, o.m)(n, a);
          },
          p(e, n) {
            32 & n &&
              c !== (c = (e[5].length > 7 ? e[5].slice(0, 7) : e[5]) + "") &&
              (0, o.v)(t, c),
              4 & n && (0, o.v)(a, e[2]);
          },
          i(e) {
            e &&
              (i ||
                (0, o.U)(() => {
                  (i = (0, o.V)(n, o.X, {})), i.start();
                }));
          },
          o: o.n,
          d(e) {
            e && (0, o.d)(n);
          },
        };
      }
      function Ze(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d,
          u,
          m,
          p,
          v,
          f,
          g,
          h,
          b,
          x,
          w,
          y,
          k,
          $,
          C,
          j,
          G,
          I,
          T,
          _,
          F,
          H,
          L = (e[8] ? (0, o.D)(e[8]) : e[7] ? (0, o.D)(e[7]) : e[6]) + "";
        (i = new o.W({
          props: {
            size: 32,
            padding: 4,
            background: "white",
            border: "darkGreen",
            radius: 8,
            icon: (e[9] && e[9].icon) || o.ae,
          },
        })),
          (s = new o.W({
            props: {
              size: 32,
              padding: 4,
              background: "green",
              border: "darkGreen",
              radius: 8,
              icon: e[1] ? e[1].icon : "",
            },
          })),
          (m = new o.R({ props: { size: 14 } }));
        let M = e[5] && Ee(e);
        return (
          ($ = new o.W({
            props: {
              size: 22,
              padding: 4,
              background: "custom",
              color: e[4]
                ? e[4].icon
                  ? void 0
                  : "var(--onboard-primary-100, var(--primary-100))"
                : "var(\n                    --account-center-chain-warning,\n                    var(--onboard-warning-500, var(--warning-500))\n                  )",
              customBackgroundColor: e[4]
                ? e[4].color || (e[3] && e[3].color) || o.a6.color
                : "var(--onboard-warning-200, var(--warning-200))",
              border: "transparent",
              radius: 25,
              icon: e[4] ? e[4].icon || (e[3] && e[3].icon) || o.a6.icon : A,
            },
          })),
          (j = new S({
            props: {
              chains: e[11],
              colorVar: "--account-center-minimized-network-selector-color",
              selectIcon: z,
              parentCSSId: "minimized_ac",
            },
          })),
          {
            c() {
              (n = (0, o.j)("div")),
                (t = (0, o.j)("div")),
                (r = (0, o.j)("div")),
                (a = (0, o.j)("div")),
                (0, o.F)(i.$$.fragment),
                (c = (0, o.G)()),
                (l = (0, o.j)("div")),
                (0, o.F)(s.$$.fragment),
                (d = (0, o.G)()),
                (u = (0, o.j)("div")),
                (0, o.F)(m.$$.fragment),
                (p = (0, o.G)()),
                (v = (0, o.j)("div")),
                (f = (0, o.j)("div")),
                (g = (0, o.t)(L)),
                (h = (0, o.G)()),
                M && M.c(),
                (b = (0, o.G)()),
                (x = (0, o.j)("div")),
                (w = (0, o.j)("div")),
                (y = (0, o.j)("div")),
                (k = (0, o.j)("div")),
                (0, o.F)($.$$.fragment),
                (C = (0, o.G)()),
                (0, o.F)(j.$$.fragment),
                (0, o.k)(a, "class", "drop-shadow svelte-1xsvwqj"),
                (0, o.T)(l, "margin-left", "-0.5rem"),
                (0, o.k)(l, "class", "drop-shadow svelte-1xsvwqj"),
                (0, o.T)(u, "right", "-4px"),
                (0, o.T)(u, "bottom", "-4px"),
                (0, o.k)(u, "class", "drop-shadow absolute svelte-1xsvwqj"),
                (0, o.k)(r, "class", "flex relative"),
                (0, o.k)(f, "class", "address svelte-1xsvwqj"),
                (0, o.k)(v, "class", "wallet-info svelte-1xsvwqj"),
                (0, o.k)(k, "class", "chain-icon-container svelte-1xsvwqj"),
                (0, o.k)(y, "class", "flex items-center"),
                (0, o.k)(
                  w,
                  "class",
                  "container shadow-1 flex items-center svelte-1xsvwqj",
                ),
                (0, o.k)(
                  w,
                  "style",
                  (G = `border-color: var(${e[4] ? "--onboard-primary-200, var(--primary-200)" : "--onboard-warning-500, var(--warning-500)"}); background-color: var(${e[4] ? "--account-center-minimized-chain-select-background, var(--primary-100)" : "--account-center-minimized-chain-select-background-warning, var(--warning-100)"})`),
                ),
                (0, o.k)(x, "class", "network"),
                (0, o.k)(t, "class", "inner-row svelte-1xsvwqj"),
                (0, o.k)(n, "class", "ac-trigger svelte-1xsvwqj");
            },
            m(z, A) {
              (0, o.b)(z, n, A),
                (0, o.m)(n, t),
                (0, o.m)(t, r),
                (0, o.m)(r, a),
                (0, o.I)(i, a, null),
                (0, o.m)(r, c),
                (0, o.m)(r, l),
                (0, o.I)(s, l, null),
                (0, o.m)(r, d),
                (0, o.m)(r, u),
                (0, o.I)(m, u, null),
                (0, o.m)(t, p),
                (0, o.m)(t, v),
                (0, o.m)(v, f),
                (0, o.m)(f, g),
                (0, o.m)(v, h),
                M && M.m(v, null),
                (0, o.m)(t, b),
                (0, o.m)(t, x),
                (0, o.m)(x, w),
                (0, o.m)(w, y),
                (0, o.m)(y, k),
                (0, o.I)($, k, null),
                (0, o.m)(y, C),
                (0, o.I)(j, y, null),
                (_ = !0),
                F ||
                  ((H = [
                    (0, o.p)(w, "click", (0, o.J)(e[15])),
                    (0, o.p)(
                      n,
                      "click",
                      (0, o.J)(function () {
                        (0, o.Z)(e[0]) && e[0].apply(this, arguments);
                      }),
                    ),
                  ]),
                  (F = !0));
            },
            p(n, [t]) {
              e = n;
              const r = {};
              512 & t && (r.icon = (e[9] && e[9].icon) || o.ae), i.$set(r);
              const a = {};
              2 & t && (a.icon = e[1] ? e[1].icon : ""),
                s.$set(a),
                (!_ || 448 & t) &&
                  L !==
                    (L =
                      (e[8] ? (0, o.D)(e[8]) : e[7] ? (0, o.D)(e[7]) : e[6]) +
                      "") &&
                  (0, o.v)(g, L),
                e[5]
                  ? M
                    ? (M.p(e, t), 32 & t && (0, o.x)(M, 1))
                    : ((M = Ee(e)), M.c(), (0, o.x)(M, 1), M.m(v, null))
                  : M && (M.d(1), (M = null));
              const c = {};
              16 & t &&
                (c.color = e[4]
                  ? e[4].icon
                    ? void 0
                    : "var(--onboard-primary-100, var(--primary-100))"
                  : "var(\n                    --account-center-chain-warning,\n                    var(--onboard-warning-500, var(--warning-500))\n                  )"),
                24 & t &&
                  (c.customBackgroundColor = e[4]
                    ? e[4].color || (e[3] && e[3].color) || o.a6.color
                    : "var(--onboard-warning-200, var(--warning-200))"),
                24 & t &&
                  (c.icon = e[4]
                    ? e[4].icon || (e[3] && e[3].icon) || o.a6.icon
                    : A),
                $.$set(c),
                (!_ ||
                  (16 & t &&
                    G !==
                      (G = `border-color: var(${e[4] ? "--onboard-primary-200, var(--primary-200)" : "--onboard-warning-500, var(--warning-500)"}); background-color: var(${e[4] ? "--account-center-minimized-chain-select-background, var(--primary-100)" : "--account-center-minimized-chain-select-background-warning, var(--warning-100)"})`))) &&
                  (0, o.k)(w, "style", G);
            },
            i(e) {
              _ ||
                ((0, o.x)(i.$$.fragment, e),
                (0, o.x)(s.$$.fragment, e),
                (0, o.x)(m.$$.fragment, e),
                (0, o.x)(M),
                (0, o.x)($.$$.fragment, e),
                (0, o.x)(j.$$.fragment, e),
                e &&
                  (0, o.U)(() => {
                    _ &&
                      (T && T.end(1),
                      (I = (0, o.V)(n, o.X, { duration: 250 })),
                      I.start());
                  }),
                (_ = !0));
            },
            o(e) {
              (0, o.A)(i.$$.fragment, e),
                (0, o.A)(s.$$.fragment, e),
                (0, o.A)(m.$$.fragment, e),
                (0, o.A)($.$$.fragment, e),
                (0, o.A)(j.$$.fragment, e),
                I && I.invalidate(),
                (T = (0, o.ak)(n, o.X, { duration: 100 })),
                (_ = !1);
            },
            d(e) {
              e && (0, o.d)(n),
                (0, o.K)(i),
                (0, o.K)(s),
                (0, o.K)(m),
                M && M.d(),
                (0, o.K)($),
                (0, o.K)(j),
                e && T && T.end(),
                (F = !1),
                (0, o.L)(H);
            },
          }
        );
      }
      function Ke(e, n, t) {
        let r, a, i, c, l, s, d, u, m, p, v, f;
        (0, o.c)(e, o.w, (e) => t(14, (v = e)));
        let { toggle: b } = n;
        const x = o.a3
          .select("appMetadata")
          .pipe((0, g.O)(o.a3.get().appMetadata), (0, h.d)(1));
        (0, o.c)(e, x, (e) => t(9, (f = e)));
        const w = o.a3.get().chains;
        return (
          (e.$$set = (e) => {
            "toggle" in e && t(0, (b = e.toggle));
          }),
          (e.$$.update = () => {
            16384 & e.$$.dirty && t(1, ([r] = v), r),
              2 & e.$$.dirty && t(13, ([a] = r ? r.accounts : []), a),
              8192 & e.$$.dirty &&
                t(8, (i = a && a.ens && (0, o.D)(a.ens.name))),
              8192 & e.$$.dirty &&
                t(7, (c = a && a.uns && (0, o.D)(a.uns.name))),
              8192 & e.$$.dirty && t(6, (l = a ? (0, o.E)(a.address) : "")),
              8192 & e.$$.dirty &&
                t(2, ([s] = a && a.balance ? Object.keys(a.balance) : []), s),
              8196 & e.$$.dirty &&
                t(5, (d = a && a.balance ? a.balance[s] : null)),
              2 & e.$$.dirty && t(12, (u = r && r.chains[0])),
              4096 & e.$$.dirty &&
                t(
                  4,
                  (m = w.find(
                    ({ id: e, namespace: n }) =>
                      !!u && e === u.id && n === u.namespace,
                  )),
                ),
              4096 & e.$$.dirty && t(3, (p = (0, o.a4)(u && u.id)));
          }),
          [
            b,
            r,
            s,
            p,
            m,
            d,
            l,
            c,
            i,
            f,
            x,
            w,
            u,
            a,
            v,
            function (n) {
              o.ai.call(this, e, n);
            },
          ]
        );
      }
      class Be extends o.S {
        constructor(e) {
          super(), (0, o.i)(this, e, Ke, Ze, o.s, { toggle: 0 }, De);
        }
      }
      function We(e) {
        (0, o.a)(
          e,
          "svelte-1o9vinu",
          ".ac-trigger.svelte-1o9vinu{--background-color:var(\n      --account-center-minimized-background,\n      var(--w3o-background-color, white)\n    );--text-color:var(--w3o-text-color, var(--gray-700));--border-color:var(\n      --account-center-border,\n      var(--w3o-border-color, var(--onboard-gray-200, var(--gray-200)))\n    );--border-radius:var(\n      --account-center-border-radius,\n      var(--w3o-border-radius, 1rem)\n    );position:relative;cursor:pointer;pointer-events:auto;min-width:80px;background:var(--background-color);color:var(--text-color);border:1px solid var(--border-color);border-radius:var(--border-radius);box-shadow:var(\n      --account-center-box-shadow,\n      var(--onboard-shadow-3, var(--shadow-3))\n    );z-index:var(--account-center-z-index, 1)}.wallet-square-wrapper.svelte-1o9vinu{position:relative;margin-left:-8px}.check-icon-wrapper.svelte-1o9vinu{position:absolute;right:-4px;bottom:-4px}.inner-row.svelte-1o9vinu{display:flex;flex-flow:row nowrap;width:80px;padding:0.75rem}.drop-shadow.svelte-1o9vinu{filter:drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.2))}",
        );
      }
      function Ne(e) {
        let n, t, r, a, i, c, l, s, d, u, m, p, v, f, g;
        return (
          (a = new o.W({
            props: {
              size: 32,
              padding: 4,
              background: "white",
              border: "darkGreen",
              radius: 8,
              icon: (e[3] && e[3].icon) || o.ae,
            },
          })),
          (s = new o.W({
            props: {
              size: 32,
              padding: 4,
              background: "green",
              border: "darkGreen",
              radius: 8,
              icon: e[1] ? e[1].icon : "",
            },
          })),
          (m = new o.R({ props: { size: 14 } })),
          {
            c() {
              (n = (0, o.j)("div")),
                (t = (0, o.j)("div")),
                (r = (0, o.j)("div")),
                (0, o.F)(a.$$.fragment),
                (i = (0, o.G)()),
                (c = (0, o.j)("div")),
                (l = (0, o.j)("div")),
                (0, o.F)(s.$$.fragment),
                (d = (0, o.G)()),
                (u = (0, o.j)("div")),
                (0, o.F)(m.$$.fragment),
                (0, o.k)(r, "class", "drop-shadow svelte-1o9vinu"),
                (0, o.k)(l, "class", "drop-shadow svelte-1o9vinu"),
                (0, o.k)(
                  u,
                  "class",
                  "check-icon-wrapper drop-shadow svelte-1o9vinu",
                ),
                (0, o.k)(c, "class", "wallet-square-wrapper svelte-1o9vinu"),
                (0, o.k)(t, "class", "inner-row svelte-1o9vinu"),
                (0, o.k)(n, "class", "ac-trigger svelte-1o9vinu"),
                (0, o.k)(
                  n,
                  "style",
                  (p = e[2].position.includes("Left")
                    ? "align-self: flex-start"
                    : null),
                );
            },
            m(p, h) {
              (0, o.b)(p, n, h),
                (0, o.m)(n, t),
                (0, o.m)(t, r),
                (0, o.I)(a, r, null),
                (0, o.m)(t, i),
                (0, o.m)(t, c),
                (0, o.m)(c, l),
                (0, o.I)(s, l, null),
                (0, o.m)(c, d),
                (0, o.m)(c, u),
                (0, o.I)(m, u, null),
                (v = !0),
                f ||
                  ((g = (0, o.p)(
                    n,
                    "click",
                    (0, o.J)(function () {
                      (0, o.Z)(e[0]) && e[0].apply(this, arguments);
                    }),
                  )),
                  (f = !0));
            },
            p(t, [r]) {
              e = t;
              const i = {};
              8 & r && (i.icon = (e[3] && e[3].icon) || o.ae), a.$set(i);
              const c = {};
              2 & r && (c.icon = e[1] ? e[1].icon : ""),
                s.$set(c),
                (!v ||
                  (4 & r &&
                    p !==
                      (p = e[2].position.includes("Left")
                        ? "align-self: flex-start"
                        : null))) &&
                  (0, o.k)(n, "style", p);
            },
            i(e) {
              v ||
                ((0, o.x)(a.$$.fragment, e),
                (0, o.x)(s.$$.fragment, e),
                (0, o.x)(m.$$.fragment, e),
                (v = !0));
            },
            o(e) {
              (0, o.A)(a.$$.fragment, e),
                (0, o.A)(s.$$.fragment, e),
                (0, o.A)(m.$$.fragment, e),
                (v = !1);
            },
            d(e) {
              e && (0, o.d)(n),
                (0, o.K)(a),
                (0, o.K)(s),
                (0, o.K)(m),
                (f = !1),
                g();
            },
          }
        );
      }
      function Oe(e, n, t) {
        let r, a, i, c;
        (0, o.c)(e, o.w, (e) => t(6, (a = e)));
        let { toggle: l } = n;
        const s = o.a3
          .select("appMetadata")
          .pipe((0, g.O)(o.a3.get().appMetadata), (0, h.d)(1));
        (0, o.c)(e, s, (e) => t(3, (c = e)));
        const d = o.a3
          .select("accountCenter")
          .pipe((0, g.O)(o.a3.get().accountCenter), (0, h.d)(1));
        return (
          (0, o.c)(e, d, (e) => t(2, (i = e))),
          (e.$$set = (e) => {
            "toggle" in e && t(0, (l = e.toggle));
          }),
          (e.$$.update = () => {
            64 & e.$$.dirty && t(1, ([r] = a), r);
          }),
          [l, r, i, c, s, d, a]
        );
      }
      class Re extends o.S {
        constructor(e) {
          super(), (0, o.i)(this, e, Oe, Ne, o.s, { toggle: 0 }, We);
        }
      }
      function Ue(e) {
        (0, o.a)(
          e,
          "svelte-1nua59o",
          ".ac-container.svelte-1nua59o{display:flex;flex-flow:column;align-items:flex-end;gap:0.5rem}",
        );
      }
      function Je(e) {
        let n, t;
        return (
          (n = new qe({ props: { expanded: e[0] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, t) {
              const o = {};
              1 & t && (o.expanded = e[0]), n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Xe(e) {
        let n, t;
        return (
          (n = new Be({ props: { toggle: e[4] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p: o.n,
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Ye(e) {
        let n, t;
        return (
          (n = new Re({ props: { toggle: e[4] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p: o.n,
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function Qe(e) {
        let n, t;
        return (
          (n = new qe({ props: { expanded: e[0] } })),
          {
            c() {
              (0, o.F)(n.$$.fragment);
            },
            m(e, r) {
              (0, o.I)(n, e, r), (t = !0);
            },
            p(e, t) {
              const o = {};
              1 & t && (o.expanded = e[0]), n.$set(o);
            },
            i(e) {
              t || ((0, o.x)(n.$$.fragment, e), (t = !0));
            },
            o(e) {
              (0, o.A)(n.$$.fragment, e), (t = !1);
            },
            d(e) {
              (0, o.K)(n, e);
            },
          }
        );
      }
      function en(e) {
        let n,
          t,
          r,
          a,
          i,
          c,
          l,
          s,
          d = e[1].position.includes("bottom"),
          u = e[1].position.includes("top"),
          m = d && Je(e);
        const p = [Ye, Xe],
          v = [];
        function f(e, n) {
          return e[1].minimal ? 0 : 1;
        }
        (r = f(e)), (a = v[r] = p[r](e));
        let g = u && Qe(e);
        return {
          c() {
            (n = (0, o.j)("div")),
              m && m.c(),
              (t = (0, o.G)()),
              a.c(),
              (i = (0, o.G)()),
              g && g.c(),
              (0, o.k)(n, "class", "ac-container svelte-1nua59o");
          },
          m(a, d) {
            (0, o.b)(a, n, d),
              m && m.m(n, null),
              (0, o.m)(n, t),
              v[r].m(n, null),
              (0, o.m)(n, i),
              g && g.m(n, null),
              (c = !0),
              l || ((s = (0, o.p)(window, "click", e[3])), (l = !0));
          },
          p(e, [c]) {
            2 & c && (d = e[1].position.includes("bottom")),
              d
                ? m
                  ? (m.p(e, c), 2 & c && (0, o.x)(m, 1))
                  : ((m = Je(e)), m.c(), (0, o.x)(m, 1), m.m(n, t))
                : m &&
                  ((0, o.y)(),
                  (0, o.A)(m, 1, 1, () => {
                    m = null;
                  }),
                  (0, o.z)());
            let l = r;
            (r = f(e)),
              r === l
                ? v[r].p(e, c)
                : ((0, o.y)(),
                  (0, o.A)(v[l], 1, 1, () => {
                    v[l] = null;
                  }),
                  (0, o.z)(),
                  (a = v[r]),
                  a ? a.p(e, c) : ((a = v[r] = p[r](e)), a.c()),
                  (0, o.x)(a, 1),
                  a.m(n, i)),
              2 & c && (u = e[1].position.includes("top")),
              u
                ? g
                  ? (g.p(e, c), 2 & c && (0, o.x)(g, 1))
                  : ((g = Qe(e)), g.c(), (0, o.x)(g, 1), g.m(n, null))
                : g &&
                  ((0, o.y)(),
                  (0, o.A)(g, 1, 1, () => {
                    g = null;
                  }),
                  (0, o.z)());
          },
          i(e) {
            c || ((0, o.x)(m), (0, o.x)(a), (0, o.x)(g), (c = !0));
          },
          o(e) {
            (0, o.A)(m), (0, o.A)(a), (0, o.A)(g), (c = !1);
          },
          d(e) {
            e && (0, o.d)(n), m && m.d(), v[r].d(), g && g.d(), (l = !1), s();
          },
        };
      }
      function nn(e, n, t) {
        let r,
          a = !1;
        const i = o.a3
          .select("accountCenter")
          .pipe((0, g.O)(o.a3.get().accountCenter), (0, h.d)(1));
        function c() {
          r.expanded && ((0, o.am)({ expanded: !1 }), t(0, (a = !1)));
        }
        return (
          (0, o.c)(e, i, (e) => t(1, (r = e))),
          (0, o.al)(c),
          [
            a,
            r,
            i,
            c,
            function () {
              (0, o.am)({ expanded: !r.expanded }), t(0, (a = !a));
            },
          ]
        );
      }
      class tn extends o.S {
        constructor(e) {
          super(), (0, o.i)(this, e, nn, en, o.s, {}, Ue);
        }
      }
    },
  },
]);
