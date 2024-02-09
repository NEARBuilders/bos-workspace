"use strict";
(self.webpackChunkbos_workspace_gateway =
  self.webpackChunkbos_workspace_gateway || []).push([
  [9850],
  {
    9850: (t, e, r) => {
      r.d(e, { StaticJsonRpcProvider: () => nt });
      var n = r(53587),
        o = r(80711);
      const s = "providers/5.5.0";
      var i = r(48171),
        l = r(2593),
        a = r(93286),
        c = r(67827),
        u = r(44242),
        h = r(64377),
        d = r(58341),
        f = r(64353),
        m = r(57727),
        g = r(57218),
        p = r(78339),
        k = r(79861),
        v = r(23951),
        _ = r(92882),
        b = r.n(_),
        w = r(64594),
        y = r(9279);
      const N = new o.Yd(s);
      class E {
        constructor() {
          N.checkNew(new.target, E), (this.formats = this.getDefaultFormats());
        }
        getDefaultFormats() {
          const t = {},
            e = this.address.bind(this),
            r = this.bigNumber.bind(this),
            o = this.blockTag.bind(this),
            s = this.data.bind(this),
            i = this.hash.bind(this),
            l = this.hex.bind(this),
            a = this.number.bind(this),
            c = this.type.bind(this);
          return (
            (t.transaction = {
              hash: i,
              type: c,
              accessList: E.allowNull(this.accessList.bind(this), null),
              blockHash: E.allowNull(i, null),
              blockNumber: E.allowNull(a, null),
              transactionIndex: E.allowNull(a, null),
              confirmations: E.allowNull(a, null),
              from: e,
              gasPrice: E.allowNull(r),
              maxPriorityFeePerGas: E.allowNull(r),
              maxFeePerGas: E.allowNull(r),
              gasLimit: r,
              to: E.allowNull(e, null),
              value: r,
              nonce: a,
              data: s,
              r: E.allowNull(this.uint256),
              s: E.allowNull(this.uint256),
              v: E.allowNull(a),
              creates: E.allowNull(e, null),
              raw: E.allowNull(s),
            }),
            (t.transactionRequest = {
              from: E.allowNull(e),
              nonce: E.allowNull(a),
              gasLimit: E.allowNull(r),
              gasPrice: E.allowNull(r),
              maxPriorityFeePerGas: E.allowNull(r),
              maxFeePerGas: E.allowNull(r),
              to: E.allowNull(e),
              value: E.allowNull(r),
              data: E.allowNull((t) => this.data(t, !0)),
              type: E.allowNull(a),
              accessList: E.allowNull(this.accessList.bind(this), null),
            }),
            (t.receiptLog = {
              transactionIndex: a,
              blockNumber: a,
              transactionHash: i,
              address: e,
              topics: E.arrayOf(i),
              data: s,
              logIndex: a,
              blockHash: i,
            }),
            (t.receipt = {
              to: E.allowNull(this.address, null),
              from: E.allowNull(this.address, null),
              contractAddress: E.allowNull(e, null),
              transactionIndex: a,
              root: E.allowNull(l),
              gasUsed: r,
              logsBloom: E.allowNull(s),
              blockHash: i,
              transactionHash: i,
              logs: E.arrayOf(this.receiptLog.bind(this)),
              blockNumber: a,
              confirmations: E.allowNull(a, null),
              cumulativeGasUsed: r,
              effectiveGasPrice: E.allowNull(r),
              status: E.allowNull(a),
              type: c,
            }),
            (t.block = {
              hash: i,
              parentHash: i,
              number: a,
              timestamp: a,
              nonce: E.allowNull(l),
              difficulty: this.difficulty.bind(this),
              gasLimit: r,
              gasUsed: r,
              miner: e,
              extraData: s,
              transactions: E.allowNull(E.arrayOf(i)),
              baseFeePerGas: E.allowNull(r),
            }),
            (t.blockWithTransactions = (0, n.DC)(t.block)),
            (t.blockWithTransactions.transactions = E.allowNull(
              E.arrayOf(this.transactionResponse.bind(this)),
            )),
            (t.filter = {
              fromBlock: E.allowNull(o, void 0),
              toBlock: E.allowNull(o, void 0),
              blockHash: E.allowNull(i, void 0),
              address: E.allowNull(e, void 0),
              topics: E.allowNull(this.topics.bind(this), void 0),
            }),
            (t.filterLog = {
              blockNumber: E.allowNull(a),
              blockHash: E.allowNull(i),
              transactionIndex: a,
              removed: E.allowNull(this.boolean.bind(this)),
              address: e,
              data: E.allowFalsish(s, "0x"),
              topics: E.arrayOf(i),
              transactionHash: i,
              logIndex: a,
            }),
            t
          );
        }
        accessList(t) {
          return (0, h.z7)(t || []);
        }
        number(t) {
          return "0x" === t ? 0 : l.O$.from(t).toNumber();
        }
        type(t) {
          return "0x" === t || null == t ? 0 : l.O$.from(t).toNumber();
        }
        bigNumber(t) {
          return l.O$.from(t);
        }
        boolean(t) {
          if ("boolean" == typeof t) return t;
          if ("string" == typeof t) {
            if ("true" === (t = t.toLowerCase())) return !0;
            if ("false" === t) return !1;
          }
          throw new Error("invalid boolean - " + t);
        }
        hex(t, e) {
          return "string" == typeof t &&
            (e || "0x" === t.substring(0, 2) || (t = "0x" + t), (0, a.A7)(t))
            ? t.toLowerCase()
            : N.throwArgumentError("invalid hash", "value", t);
        }
        data(t, e) {
          const r = this.hex(t, e);
          if (r.length % 2 != 0)
            throw new Error("invalid data; odd-length - " + t);
          return r;
        }
        address(t) {
          return (0, w.Kn)(t);
        }
        callAddress(t) {
          if (!(0, a.A7)(t, 32)) return null;
          const e = (0, w.Kn)((0, a.p3)(t, 12));
          return e === y.d ? null : e;
        }
        contractAddress(t) {
          return (0, w.CR)(t);
        }
        blockTag(t) {
          if (null == t) return "latest";
          if ("earliest" === t) return "0x0";
          if ("latest" === t || "pending" === t) return t;
          if ("number" == typeof t || (0, a.A7)(t)) return (0, a.$P)(t);
          throw new Error("invalid blockTag");
        }
        hash(t, e) {
          const r = this.hex(t, e);
          return 32 !== (0, a.E1)(r)
            ? N.throwArgumentError("invalid hash", "value", t)
            : r;
        }
        difficulty(t) {
          if (null == t) return null;
          const e = l.O$.from(t);
          try {
            return e.toNumber();
          } catch (t) {}
          return null;
        }
        uint256(t) {
          if (!(0, a.A7)(t)) throw new Error("invalid uint256");
          return (0, a.$m)(t, 32);
        }
        _block(t, e) {
          null != t.author && null == t.miner && (t.miner = t.author);
          const r = null != t._difficulty ? t._difficulty : t.difficulty,
            n = E.check(e, t);
          return (n._difficulty = null == r ? null : l.O$.from(r)), n;
        }
        block(t) {
          return this._block(t, this.formats.block);
        }
        blockWithTransactions(t) {
          return this._block(t, this.formats.blockWithTransactions);
        }
        transactionRequest(t) {
          return E.check(this.formats.transactionRequest, t);
        }
        transactionResponse(t) {
          null != t.gas && null == t.gasLimit && (t.gasLimit = t.gas),
            t.to &&
              l.O$.from(t.to).isZero() &&
              (t.to = "0x0000000000000000000000000000000000000000"),
            null != t.input && null == t.data && (t.data = t.input),
            null == t.to &&
              null == t.creates &&
              (t.creates = this.contractAddress(t)),
            (1 !== t.type && 2 !== t.type) ||
              null != t.accessList ||
              (t.accessList = []);
          const e = E.check(this.formats.transaction, t);
          if (null != t.chainId) {
            let r = t.chainId;
            (0, a.A7)(r) && (r = l.O$.from(r).toNumber()), (e.chainId = r);
          } else {
            let r = t.networkId;
            null == r && null == e.v && (r = t.chainId),
              (0, a.A7)(r) && (r = l.O$.from(r).toNumber()),
              "number" != typeof r &&
                null != e.v &&
                ((r = (e.v - 35) / 2), r < 0 && (r = 0), (r = parseInt(r))),
              "number" != typeof r && (r = 0),
              (e.chainId = r);
          }
          return (
            e.blockHash &&
              "x" === e.blockHash.replace(/0/g, "") &&
              (e.blockHash = null),
            e
          );
        }
        transaction(t) {
          return (0, h.Qc)(t);
        }
        receiptLog(t) {
          return E.check(this.formats.receiptLog, t);
        }
        receipt(t) {
          const e = E.check(this.formats.receipt, t);
          if (null != e.root)
            if (e.root.length <= 4) {
              const t = l.O$.from(e.root).toNumber();
              0 === t || 1 === t
                ? (null != e.status &&
                    e.status !== t &&
                    N.throwArgumentError(
                      "alt-root-status/status mismatch",
                      "value",
                      { root: e.root, status: e.status },
                    ),
                  (e.status = t),
                  delete e.root)
                : N.throwArgumentError(
                    "invalid alt-root-status",
                    "value.root",
                    e.root,
                  );
            } else
              66 !== e.root.length &&
                N.throwArgumentError("invalid root hash", "value.root", e.root);
          return null != e.status && (e.byzantium = !0), e;
        }
        topics(t) {
          return Array.isArray(t)
            ? t.map((t) => this.topics(t))
            : null != t
              ? this.hash(t, !0)
              : null;
        }
        filter(t) {
          return E.check(this.formats.filter, t);
        }
        filterLog(t) {
          return E.check(this.formats.filterLog, t);
        }
        static check(t, e) {
          const r = {};
          for (const n in t)
            try {
              const o = t[n](e[n]);
              void 0 !== o && (r[n] = o);
            } catch (t) {
              throw ((t.checkKey = n), (t.checkValue = e[n]), t);
            }
          return r;
        }
        static allowNull(t, e) {
          return function (r) {
            return null == r ? e : t(r);
          };
        }
        static allowFalsish(t, e) {
          return function (r) {
            return r ? t(r) : e;
          };
        }
        static arrayOf(t) {
          return function (e) {
            if (!Array.isArray(e)) throw new Error("not an array");
            const r = [];
            return (
              e.forEach(function (e) {
                r.push(t(e));
              }),
              r
            );
          };
        }
      }
      var T = function (t, e, r, n) {
        return new (r || (r = Promise))(function (o, s) {
          function i(t) {
            try {
              a(n.next(t));
            } catch (t) {
              s(t);
            }
          }
          function l(t) {
            try {
              a(n.throw(t));
            } catch (t) {
              s(t);
            }
          }
          function a(t) {
            var e;
            t.done
              ? o(t.value)
              : ((e = t.value),
                e instanceof r
                  ? e
                  : new r(function (t) {
                      t(e);
                    })).then(i, l);
          }
          a((n = n.apply(t, e || [])).next());
        });
      };
      const R = new o.Yd(s);
      function x(t) {
        return null == t
          ? "null"
          : (32 !== (0, a.E1)(t) &&
              R.throwArgumentError("invalid topic", "topic", t),
            t.toLowerCase());
      }
      function P(t) {
        for (t = t.slice(); t.length > 0 && null == t[t.length - 1]; ) t.pop();
        return t
          .map((t) => {
            if (Array.isArray(t)) {
              const e = {};
              t.forEach((t) => {
                e[x(t)] = !0;
              });
              const r = Object.keys(e);
              return r.sort(), r.join("|");
            }
            return x(t);
          })
          .join("&");
      }
      function O(t) {
        if ("string" == typeof t) {
          if (((t = t.toLowerCase()), 32 === (0, a.E1)(t))) return "tx:" + t;
          if (-1 === t.indexOf(":")) return t;
        } else {
          if (Array.isArray(t)) return "filter:*:" + P(t);
          if (f.Sg.isForkEvent(t))
            throw (R.warn("not implemented"), new Error("not implemented"));
          if (t && "object" == typeof t)
            return "filter:" + (t.address || "*") + ":" + P(t.topics || []);
        }
        throw new Error("invalid event - " + t);
      }
      function B() {
        return new Date().getTime();
      }
      function A(t) {
        return new Promise((e) => {
          setTimeout(e, t);
        });
      }
      const I = ["block", "network", "pending", "poll"];
      class L {
        constructor(t, e, r) {
          (0, n.zG)(this, "tag", t),
            (0, n.zG)(this, "listener", e),
            (0, n.zG)(this, "once", r);
        }
        get event() {
          switch (this.type) {
            case "tx":
              return this.hash;
            case "filter":
              return this.filter;
          }
          return this.tag;
        }
        get type() {
          return this.tag.split(":")[0];
        }
        get hash() {
          const t = this.tag.split(":");
          return "tx" !== t[0] ? null : t[1];
        }
        get filter() {
          const t = this.tag.split(":");
          if ("filter" !== t[0]) return null;
          const e = t[1],
            r =
              "" === (n = t[2])
                ? []
                : n.split(/&/g).map((t) => {
                    if ("" === t) return [];
                    const e = t
                      .split("|")
                      .map((t) => ("null" === t ? null : t));
                    return 1 === e.length ? e[0] : e;
                  });
          var n;
          const o = {};
          return (
            r.length > 0 && (o.topics = r), e && "*" !== e && (o.address = e), o
          );
        }
        pollable() {
          return this.tag.indexOf(":") >= 0 || I.indexOf(this.tag) >= 0;
        }
      }
      const C = {
        0: { symbol: "btc", p2pkh: 0, p2sh: 5, prefix: "bc" },
        2: { symbol: "ltc", p2pkh: 48, p2sh: 50, prefix: "ltc" },
        3: { symbol: "doge", p2pkh: 30, p2sh: 22 },
        60: { symbol: "eth", ilk: "eth" },
        61: { symbol: "etc", ilk: "eth" },
        700: { symbol: "xdai", ilk: "eth" },
      };
      function S(t) {
        return (0, a.$m)(l.O$.from(t).toHexString(), 32);
      }
      function $(t) {
        return m.eU.encode(
          (0, a.zo)([t, (0, a.p3)((0, v.JQ)((0, v.JQ)(t)), 0, 4)]),
        );
      }
      const Y = [
        new RegExp("^(https)://(.*)$", "i"),
        new RegExp("^(data):(.*)$", "i"),
        new RegExp("^(ipfs)://(.*)$", "i"),
        new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i"),
      ];
      function D(t) {
        try {
          return (0, u.ZN)(G(t));
        } catch (t) {}
        return null;
      }
      function G(t) {
        if ("0x" === t) return null;
        const e = l.O$.from((0, a.p3)(t, 0, 32)).toNumber(),
          r = l.O$.from((0, a.p3)(t, e, e + 32)).toNumber();
        return (0, a.p3)(t, e + 32, e + 32 + r);
      }
      class F {
        constructor(t, e, r, o) {
          (0, n.zG)(this, "provider", t),
            (0, n.zG)(this, "name", r),
            (0, n.zG)(this, "address", t.formatter.address(e)),
            (0, n.zG)(this, "_resolvedAddress", o);
        }
        _fetchBytes(t, e) {
          return T(this, void 0, void 0, function* () {
            const r = {
              to: this.address,
              data: (0, a.xs)([t, (0, p.VM)(this.name), e || "0x"]),
            };
            try {
              return G(yield this.provider.call(r));
            } catch (t) {
              return t.code, o.Yd.errors.CALL_EXCEPTION, null;
            }
          });
        }
        _getAddress(t, e) {
          const r = C[String(t)];
          if (
            (null == r &&
              R.throwError(
                `unsupported coin type: ${t}`,
                o.Yd.errors.UNSUPPORTED_OPERATION,
                { operation: `getAddress(${t})` },
              ),
            "eth" === r.ilk)
          )
            return this.provider.formatter.address(e);
          const n = (0, a.lE)(e);
          if (null != r.p2pkh) {
            const t = e.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
            if (t) {
              const e = parseInt(t[1], 16);
              if (t[2].length === 2 * e && e >= 1 && e <= 75)
                return $((0, a.zo)([[r.p2pkh], "0x" + t[2]]));
            }
          }
          if (null != r.p2sh) {
            const t = e.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
            if (t) {
              const e = parseInt(t[1], 16);
              if (t[2].length === 2 * e && e >= 1 && e <= 75)
                return $((0, a.zo)([[r.p2sh], "0x" + t[2]]));
            }
          }
          if (null != r.prefix) {
            const t = n[1];
            let e = n[0];
            if (
              (0 === e ? 20 !== t && 32 !== t && (e = -1) : (e = -1),
              e >= 0 && n.length === 2 + t && t >= 1 && t <= 75)
            ) {
              const t = b().toWords(n.slice(2));
              return t.unshift(e), b().encode(r.prefix, t);
            }
          }
          return null;
        }
        getAddress(t) {
          return T(this, void 0, void 0, function* () {
            if ((null == t && (t = 60), 60 === t))
              try {
                const t = {
                    to: this.address,
                    data: "0x3b3b57de" + (0, p.VM)(this.name).substring(2),
                  },
                  e = yield this.provider.call(t);
                return "0x" === e || e === g.R
                  ? null
                  : this.provider.formatter.callAddress(e);
              } catch (t) {
                if (t.code === o.Yd.errors.CALL_EXCEPTION) return null;
                throw t;
              }
            const e = yield this._fetchBytes("0xf1cb7e06", S(t));
            if (null == e || "0x" === e) return null;
            const r = this._getAddress(t, e);
            return (
              null == r &&
                R.throwError(
                  "invalid or unsupported coin data",
                  o.Yd.errors.UNSUPPORTED_OPERATION,
                  { operation: `getAddress(${t})`, coinType: t, data: e },
                ),
              r
            );
          });
        }
        getAvatar() {
          return T(this, void 0, void 0, function* () {
            const t = [];
            try {
              const e = yield this.getText("avatar");
              if (null == e) return null;
              for (let r = 0; r < Y.length; r++) {
                const n = e.match(Y[r]);
                if (null != n)
                  switch (n[1]) {
                    case "https":
                      return (
                        t.push({ type: "url", content: e }),
                        { linkage: t, url: e }
                      );
                    case "data":
                      return (
                        t.push({ type: "data", content: e }),
                        { linkage: t, url: e }
                      );
                    case "ipfs":
                      return (
                        t.push({ type: "ipfs", content: e }),
                        {
                          linkage: t,
                          url: `https://gateway.ipfs.io/ipfs/${e.substring(7)}`,
                        }
                      );
                    case "erc721":
                    case "erc1155": {
                      const r = "erc721" === n[1] ? "0xc87b56dd" : "0x0e89341c";
                      t.push({ type: n[1], content: e });
                      const o =
                          this._resolvedAddress || (yield this.getAddress()),
                        s = (n[2] || "").split("/");
                      if (2 !== s.length) return null;
                      const i = yield this.provider.formatter.address(s[0]),
                        c = (0, a.$m)(l.O$.from(s[1]).toHexString(), 32);
                      if ("erc721" === n[1]) {
                        const e = this.provider.formatter.callAddress(
                          yield this.provider.call({
                            to: i,
                            data: (0, a.xs)(["0x6352211e", c]),
                          }),
                        );
                        if (o !== e) return null;
                        t.push({ type: "owner", content: e });
                      } else if ("erc1155" === n[1]) {
                        const e = l.O$.from(
                          yield this.provider.call({
                            to: i,
                            data: (0, a.xs)([
                              "0x00fdd58e",
                              (0, a.$m)(o, 32),
                              c,
                            ]),
                          }),
                        );
                        if (e.isZero()) return null;
                        t.push({ type: "balance", content: e.toString() });
                      }
                      const u = {
                        to: this.provider.formatter.address(s[0]),
                        data: (0, a.xs)([r, c]),
                      };
                      let h = D(yield this.provider.call(u));
                      if (null == h) return null;
                      t.push({ type: "metadata-url", content: h }),
                        "erc1155" === n[1] &&
                          (h = h.replace("{id}", c.substring(2)));
                      const f = yield (0, d.rd)(h);
                      return f &&
                        "string" == typeof f.image &&
                        f.image.match(/^https:\/\//i)
                        ? (t.push({
                            type: "metadata",
                            content: JSON.stringify(f),
                          }),
                          t.push({ type: "url", content: f.image }),
                          { linkage: t, url: f.image })
                        : null;
                    }
                  }
              }
            } catch (t) {}
            return null;
          });
        }
        getContentHash() {
          return T(this, void 0, void 0, function* () {
            const t = yield this._fetchBytes("0xbc1c58d1");
            if (null == t || "0x" === t) return null;
            const e = t.match(
              /^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/,
            );
            if (e) {
              const t = parseInt(e[3], 16);
              if (e[4].length === 2 * t)
                return "ipfs://" + m.eU.encode("0x" + e[1]);
            }
            const r = t.match(/^0xe40101fa011b20([0-9a-f]*)$/);
            return r && 64 === r[1].length
              ? "bzz://" + r[1]
              : R.throwError(
                  "invalid or unsupported content hash data",
                  o.Yd.errors.UNSUPPORTED_OPERATION,
                  { operation: "getContentHash()", data: t },
                );
          });
        }
        getText(t) {
          return T(this, void 0, void 0, function* () {
            let e = (0, u.Y0)(t);
            (e = (0, a.zo)([S(64), S(e.length), e])),
              e.length % 32 != 0 &&
                (e = (0, a.zo)([e, (0, a.$m)("0x", 32 - (t.length % 32))]));
            const r = yield this._fetchBytes("0x59d1d43c", (0, a.Dv)(e));
            return null == r || "0x" === r ? null : (0, u.ZN)(r);
          });
        }
      }
      let U = null,
        H = 1;
      class z extends f.zt {
        constructor(t) {
          if (
            (R.checkNew(new.target, f.zt),
            super(),
            (this._events = []),
            (this._emitted = { block: -2 }),
            (this.formatter = new.target.getFormatter()),
            (0, n.zG)(this, "anyNetwork", "any" === t),
            this.anyNetwork && (t = this.detectNetwork()),
            t instanceof Promise)
          )
            (this._networkPromise = t),
              t.catch((t) => {}),
              this._ready().catch((t) => {});
          else {
            const e = (0, n.tu)(new.target, "getNetwork")(t);
            e
              ? ((0, n.zG)(this, "_network", e), this.emit("network", e, null))
              : R.throwArgumentError("invalid network", "network", t);
          }
          (this._maxInternalBlockNumber = -1024),
            (this._lastBlockNumber = -2),
            (this._pollingInterval = 4e3),
            (this._fastQueryDate = 0);
        }
        _ready() {
          return T(this, void 0, void 0, function* () {
            if (null == this._network) {
              let t = null;
              if (this._networkPromise)
                try {
                  t = yield this._networkPromise;
                } catch (t) {}
              null == t && (t = yield this.detectNetwork()),
                t ||
                  R.throwError(
                    "no network detected",
                    o.Yd.errors.UNKNOWN_ERROR,
                    {},
                  ),
                null == this._network &&
                  (this.anyNetwork
                    ? (this._network = t)
                    : (0, n.zG)(this, "_network", t),
                  this.emit("network", t, null));
            }
            return this._network;
          });
        }
        get ready() {
          return (0, d.$l)(() =>
            this._ready().then(
              (t) => t,
              (t) => {
                if (
                  t.code !== o.Yd.errors.NETWORK_ERROR ||
                  "noNetwork" !== t.event
                )
                  throw t;
              },
            ),
          );
        }
        static getFormatter() {
          return null == U && (U = new E()), U;
        }
        static getNetwork(t) {
          return (0, k.H)(null == t ? "homestead" : t);
        }
        _getInternalBlockNumber(t) {
          return T(this, void 0, void 0, function* () {
            if ((yield this._ready(), t > 0))
              for (; this._internalBlockNumber; ) {
                const e = this._internalBlockNumber;
                try {
                  const r = yield e;
                  if (B() - r.respTime <= t) return r.blockNumber;
                  break;
                } catch (t) {
                  if (this._internalBlockNumber === e) break;
                }
              }
            const e = B(),
              r = (0, n.mE)({
                blockNumber: this.perform("getBlockNumber", {}),
                networkError: this.getNetwork().then(
                  (t) => null,
                  (t) => t,
                ),
              }).then(({ blockNumber: t, networkError: n }) => {
                if (n)
                  throw (
                    (this._internalBlockNumber === r &&
                      (this._internalBlockNumber = null),
                    n)
                  );
                const o = B();
                return (
                  (t = l.O$.from(t).toNumber()) <
                    this._maxInternalBlockNumber &&
                    (t = this._maxInternalBlockNumber),
                  (this._maxInternalBlockNumber = t),
                  this._setFastBlockNumber(t),
                  { blockNumber: t, reqTime: e, respTime: o }
                );
              });
            return (
              (this._internalBlockNumber = r),
              r.catch((t) => {
                this._internalBlockNumber === r &&
                  (this._internalBlockNumber = null);
              }),
              (yield r).blockNumber
            );
          });
        }
        poll() {
          return T(this, void 0, void 0, function* () {
            const t = H++,
              e = [];
            let r = null;
            try {
              r = yield this._getInternalBlockNumber(
                100 + this.pollingInterval / 2,
              );
            } catch (t) {
              return void this.emit("error", t);
            }
            if (
              (this._setFastBlockNumber(r),
              this.emit("poll", t, r),
              r !== this._lastBlockNumber)
            ) {
              if (
                (-2 === this._emitted.block && (this._emitted.block = r - 1),
                Math.abs(this._emitted.block - r) > 1e3)
              )
                R.warn(
                  `network block skew detected; skipping block events (emitted=${this._emitted.block} blockNumber${r})`,
                ),
                  this.emit(
                    "error",
                    R.makeError(
                      "network block skew detected",
                      o.Yd.errors.NETWORK_ERROR,
                      {
                        blockNumber: r,
                        event: "blockSkew",
                        previousBlockNumber: this._emitted.block,
                      },
                    ),
                  ),
                  this.emit("block", r);
              else
                for (let t = this._emitted.block + 1; t <= r; t++)
                  this.emit("block", t);
              this._emitted.block !== r &&
                ((this._emitted.block = r),
                Object.keys(this._emitted).forEach((t) => {
                  if ("block" === t) return;
                  const e = this._emitted[t];
                  "pending" !== e && r - e > 12 && delete this._emitted[t];
                })),
                -2 === this._lastBlockNumber && (this._lastBlockNumber = r - 1),
                this._events.forEach((t) => {
                  switch (t.type) {
                    case "tx": {
                      const r = t.hash;
                      let n = this.getTransactionReceipt(r)
                        .then((t) =>
                          t && null != t.blockNumber
                            ? ((this._emitted["t:" + r] = t.blockNumber),
                              this.emit(r, t),
                              null)
                            : null,
                        )
                        .catch((t) => {
                          this.emit("error", t);
                        });
                      e.push(n);
                      break;
                    }
                    case "filter": {
                      const n = t.filter;
                      (n.fromBlock = this._lastBlockNumber + 1),
                        (n.toBlock = r);
                      const o = this.getLogs(n)
                        .then((t) => {
                          0 !== t.length &&
                            t.forEach((t) => {
                              (this._emitted["b:" + t.blockHash] =
                                t.blockNumber),
                                (this._emitted["t:" + t.transactionHash] =
                                  t.blockNumber),
                                this.emit(n, t);
                            });
                        })
                        .catch((t) => {
                          this.emit("error", t);
                        });
                      e.push(o);
                      break;
                    }
                  }
                }),
                (this._lastBlockNumber = r),
                Promise.all(e)
                  .then(() => {
                    this.emit("didPoll", t);
                  })
                  .catch((t) => {
                    this.emit("error", t);
                  });
            } else this.emit("didPoll", t);
          });
        }
        resetEventsBlock(t) {
          (this._lastBlockNumber = t - 1), this.polling && this.poll();
        }
        get network() {
          return this._network;
        }
        detectNetwork() {
          return T(this, void 0, void 0, function* () {
            return R.throwError(
              "provider does not support network detection",
              o.Yd.errors.UNSUPPORTED_OPERATION,
              { operation: "provider.detectNetwork" },
            );
          });
        }
        getNetwork() {
          return T(this, void 0, void 0, function* () {
            const t = yield this._ready(),
              e = yield this.detectNetwork();
            if (t.chainId !== e.chainId) {
              if (this.anyNetwork)
                return (
                  (this._network = e),
                  (this._lastBlockNumber = -2),
                  (this._fastBlockNumber = null),
                  (this._fastBlockNumberPromise = null),
                  (this._fastQueryDate = 0),
                  (this._emitted.block = -2),
                  (this._maxInternalBlockNumber = -1024),
                  (this._internalBlockNumber = null),
                  this.emit("network", e, t),
                  yield A(0),
                  this._network
                );
              const r = R.makeError(
                "underlying network changed",
                o.Yd.errors.NETWORK_ERROR,
                { event: "changed", network: t, detectedNetwork: e },
              );
              throw (this.emit("error", r), r);
            }
            return t;
          });
        }
        get blockNumber() {
          return (
            this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(
              (t) => {
                this._setFastBlockNumber(t);
              },
              (t) => {},
            ),
            null != this._fastBlockNumber ? this._fastBlockNumber : -1
          );
        }
        get polling() {
          return null != this._poller;
        }
        set polling(t) {
          t && !this._poller
            ? ((this._poller = setInterval(() => {
                this.poll();
              }, this.pollingInterval)),
              this._bootstrapPoll ||
                (this._bootstrapPoll = setTimeout(() => {
                  this.poll(),
                    (this._bootstrapPoll = setTimeout(() => {
                      this._poller || this.poll(), (this._bootstrapPoll = null);
                    }, this.pollingInterval));
                }, 0)))
            : !t &&
              this._poller &&
              (clearInterval(this._poller), (this._poller = null));
        }
        get pollingInterval() {
          return this._pollingInterval;
        }
        set pollingInterval(t) {
          if ("number" != typeof t || t <= 0 || parseInt(String(t)) != t)
            throw new Error("invalid polling interval");
          (this._pollingInterval = t),
            this._poller &&
              (clearInterval(this._poller),
              (this._poller = setInterval(() => {
                this.poll();
              }, this._pollingInterval)));
        }
        _getFastBlockNumber() {
          const t = B();
          return (
            t - this._fastQueryDate > 2 * this._pollingInterval &&
              ((this._fastQueryDate = t),
              (this._fastBlockNumberPromise = this.getBlockNumber().then(
                (t) => (
                  (null == this._fastBlockNumber ||
                    t > this._fastBlockNumber) &&
                    (this._fastBlockNumber = t),
                  this._fastBlockNumber
                ),
              ))),
            this._fastBlockNumberPromise
          );
        }
        _setFastBlockNumber(t) {
          (null != this._fastBlockNumber && t < this._fastBlockNumber) ||
            ((this._fastQueryDate = B()),
            (null == this._fastBlockNumber || t > this._fastBlockNumber) &&
              ((this._fastBlockNumber = t),
              (this._fastBlockNumberPromise = Promise.resolve(t))));
        }
        waitForTransaction(t, e, r) {
          return T(this, void 0, void 0, function* () {
            return this._waitForTransaction(t, null == e ? 1 : e, r || 0, null);
          });
        }
        _waitForTransaction(t, e, r, n) {
          return T(this, void 0, void 0, function* () {
            const s = yield this.getTransactionReceipt(t);
            return (s ? s.confirmations : 0) >= e
              ? s
              : new Promise((s, i) => {
                  const l = [];
                  let a = !1;
                  const c = function () {
                      return (
                        !!a ||
                        ((a = !0),
                        l.forEach((t) => {
                          t();
                        }),
                        !1)
                      );
                    },
                    u = (t) => {
                      t.confirmations < e || c() || s(t);
                    };
                  if (
                    (this.on(t, u),
                    l.push(() => {
                      this.removeListener(t, u);
                    }),
                    n)
                  ) {
                    let r = n.startBlock,
                      s = null;
                    const u = (l) =>
                      T(this, void 0, void 0, function* () {
                        a ||
                          (yield A(1e3),
                          this.getTransactionCount(n.from).then(
                            (h) =>
                              T(this, void 0, void 0, function* () {
                                if (!a) {
                                  if (h <= n.nonce) r = l;
                                  else {
                                    {
                                      const e = yield this.getTransaction(t);
                                      if (e && null != e.blockNumber) return;
                                    }
                                    for (
                                      null == s &&
                                      ((s = r - 3),
                                      s < n.startBlock && (s = n.startBlock));
                                      s <= l;

                                    ) {
                                      if (a) return;
                                      const r =
                                        yield this.getBlockWithTransactions(s);
                                      for (
                                        let s = 0;
                                        s < r.transactions.length;
                                        s++
                                      ) {
                                        const l = r.transactions[s];
                                        if (l.hash === t) return;
                                        if (
                                          l.from === n.from &&
                                          l.nonce === n.nonce
                                        ) {
                                          if (a) return;
                                          const r =
                                            yield this.waitForTransaction(
                                              l.hash,
                                              e,
                                            );
                                          if (c()) return;
                                          let s = "replaced";
                                          return (
                                            l.data === n.data &&
                                            l.to === n.to &&
                                            l.value.eq(n.value)
                                              ? (s = "repriced")
                                              : "0x" === l.data &&
                                                l.from === l.to &&
                                                l.value.isZero() &&
                                                (s = "cancelled"),
                                            void i(
                                              R.makeError(
                                                "transaction was replaced",
                                                o.Yd.errors
                                                  .TRANSACTION_REPLACED,
                                                {
                                                  cancelled:
                                                    "replaced" === s ||
                                                    "cancelled" === s,
                                                  reason: s,
                                                  replacement:
                                                    this._wrapTransaction(l),
                                                  hash: t,
                                                  receipt: r,
                                                },
                                              ),
                                            )
                                          );
                                        }
                                      }
                                      s++;
                                    }
                                  }
                                  a || this.once("block", u);
                                }
                              }),
                            (t) => {
                              a || this.once("block", u);
                            },
                          ));
                      });
                    if (a) return;
                    this.once("block", u),
                      l.push(() => {
                        this.removeListener("block", u);
                      });
                  }
                  if ("number" == typeof r && r > 0) {
                    const t = setTimeout(() => {
                      c() ||
                        i(
                          R.makeError("timeout exceeded", o.Yd.errors.TIMEOUT, {
                            timeout: r,
                          }),
                        );
                    }, r);
                    t.unref && t.unref(),
                      l.push(() => {
                        clearTimeout(t);
                      });
                  }
                });
          });
        }
        getBlockNumber() {
          return T(this, void 0, void 0, function* () {
            return this._getInternalBlockNumber(0);
          });
        }
        getGasPrice() {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const t = yield this.perform("getGasPrice", {});
            try {
              return l.O$.from(t);
            } catch (e) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "getGasPrice", result: t, error: e },
              );
            }
          });
        }
        getBalance(t, e) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const r = yield (0, n.mE)({
                address: this._getAddress(t),
                blockTag: this._getBlockTag(e),
              }),
              s = yield this.perform("getBalance", r);
            try {
              return l.O$.from(s);
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "getBalance", params: r, result: s, error: t },
              );
            }
          });
        }
        getTransactionCount(t, e) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const r = yield (0, n.mE)({
                address: this._getAddress(t),
                blockTag: this._getBlockTag(e),
              }),
              s = yield this.perform("getTransactionCount", r);
            try {
              return l.O$.from(s).toNumber();
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                {
                  method: "getTransactionCount",
                  params: r,
                  result: s,
                  error: t,
                },
              );
            }
          });
        }
        getCode(t, e) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const r = yield (0, n.mE)({
                address: this._getAddress(t),
                blockTag: this._getBlockTag(e),
              }),
              s = yield this.perform("getCode", r);
            try {
              return (0, a.Dv)(s);
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "getCode", params: r, result: s, error: t },
              );
            }
          });
        }
        getStorageAt(t, e, r) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const s = yield (0, n.mE)({
                address: this._getAddress(t),
                blockTag: this._getBlockTag(r),
                position: Promise.resolve(e).then((t) => (0, a.$P)(t)),
              }),
              i = yield this.perform("getStorageAt", s);
            try {
              return (0, a.Dv)(i);
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "getStorageAt", params: s, result: i, error: t },
              );
            }
          });
        }
        _wrapTransaction(t, e, r) {
          if (null != e && 32 !== (0, a.E1)(e))
            throw new Error("invalid response - sendTransaction");
          const n = t;
          return (
            null != e &&
              t.hash !== e &&
              R.throwError(
                "Transaction hash mismatch from Provider.sendTransaction.",
                o.Yd.errors.UNKNOWN_ERROR,
                { expectedHash: t.hash, returnedHash: e },
              ),
            (n.wait = (e, n) =>
              T(this, void 0, void 0, function* () {
                let s;
                null == e && (e = 1),
                  null == n && (n = 0),
                  0 !== e &&
                    null != r &&
                    (s = {
                      data: t.data,
                      from: t.from,
                      nonce: t.nonce,
                      to: t.to,
                      value: t.value,
                      startBlock: r,
                    });
                const i = yield this._waitForTransaction(t.hash, e, n, s);
                return null == i && 0 === e
                  ? null
                  : ((this._emitted["t:" + t.hash] = i.blockNumber),
                    0 === i.status &&
                      R.throwError(
                        "transaction failed",
                        o.Yd.errors.CALL_EXCEPTION,
                        { transactionHash: t.hash, transaction: t, receipt: i },
                      ),
                    i);
              })),
            n
          );
        }
        sendTransaction(t) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const e = yield Promise.resolve(t).then((t) => (0, a.Dv)(t)),
              r = this.formatter.transaction(t);
            null == r.confirmations && (r.confirmations = 0);
            const n = yield this._getInternalBlockNumber(
              100 + 2 * this.pollingInterval,
            );
            try {
              const t = yield this.perform("sendTransaction", {
                signedTransaction: e,
              });
              return this._wrapTransaction(r, t, n);
            } catch (t) {
              throw ((t.transaction = r), (t.transactionHash = r.hash), t);
            }
          });
        }
        _getTransactionRequest(t) {
          return T(this, void 0, void 0, function* () {
            const e = yield t,
              r = {};
            return (
              ["from", "to"].forEach((t) => {
                null != e[t] &&
                  (r[t] = Promise.resolve(e[t]).then((t) =>
                    t ? this._getAddress(t) : null,
                  ));
              }),
              [
                "gasLimit",
                "gasPrice",
                "maxFeePerGas",
                "maxPriorityFeePerGas",
                "value",
              ].forEach((t) => {
                null != e[t] &&
                  (r[t] = Promise.resolve(e[t]).then((t) =>
                    t ? l.O$.from(t) : null,
                  ));
              }),
              ["type"].forEach((t) => {
                null != e[t] &&
                  (r[t] = Promise.resolve(e[t]).then((t) =>
                    null != t ? t : null,
                  ));
              }),
              e.accessList &&
                (r.accessList = this.formatter.accessList(e.accessList)),
              ["data"].forEach((t) => {
                null != e[t] &&
                  (r[t] = Promise.resolve(e[t]).then((t) =>
                    t ? (0, a.Dv)(t) : null,
                  ));
              }),
              this.formatter.transactionRequest(yield (0, n.mE)(r))
            );
          });
        }
        _getFilter(t) {
          return T(this, void 0, void 0, function* () {
            t = yield t;
            const e = {};
            return (
              null != t.address && (e.address = this._getAddress(t.address)),
              ["blockHash", "topics"].forEach((r) => {
                null != t[r] && (e[r] = t[r]);
              }),
              ["fromBlock", "toBlock"].forEach((r) => {
                null != t[r] && (e[r] = this._getBlockTag(t[r]));
              }),
              this.formatter.filter(yield (0, n.mE)(e))
            );
          });
        }
        call(t, e) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const r = yield (0, n.mE)({
                transaction: this._getTransactionRequest(t),
                blockTag: this._getBlockTag(e),
              }),
              s = yield this.perform("call", r);
            try {
              return (0, a.Dv)(s);
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "call", params: r, result: s, error: t },
              );
            }
          });
        }
        estimateGas(t) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const e = yield (0, n.mE)({
                transaction: this._getTransactionRequest(t),
              }),
              r = yield this.perform("estimateGas", e);
            try {
              return l.O$.from(r);
            } catch (t) {
              return R.throwError(
                "bad result from backend",
                o.Yd.errors.SERVER_ERROR,
                { method: "estimateGas", params: e, result: r, error: t },
              );
            }
          });
        }
        _getAddress(t) {
          return T(this, void 0, void 0, function* () {
            "string" != typeof (t = yield t) &&
              R.throwArgumentError("invalid address or ENS name", "name", t);
            const e = yield this.resolveName(t);
            return (
              null == e &&
                R.throwError(
                  "ENS name not configured",
                  o.Yd.errors.UNSUPPORTED_OPERATION,
                  { operation: `resolveName(${JSON.stringify(t)})` },
                ),
              e
            );
          });
        }
        _getBlock(t, e) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t);
            let r = -128;
            const n = { includeTransactions: !!e };
            if ((0, a.A7)(t, 32)) n.blockHash = t;
            else
              try {
                (n.blockTag = yield this._getBlockTag(t)),
                  (0, a.A7)(n.blockTag) &&
                    (r = parseInt(n.blockTag.substring(2), 16));
              } catch (e) {
                R.throwArgumentError(
                  "invalid block hash or block tag",
                  "blockHashOrBlockTag",
                  t,
                );
              }
            return (0, d.$l)(
              () =>
                T(this, void 0, void 0, function* () {
                  const t = yield this.perform("getBlock", n);
                  if (null == t)
                    return (null != n.blockHash &&
                      null == this._emitted["b:" + n.blockHash]) ||
                      (null != n.blockTag && r > this._emitted.block)
                      ? null
                      : void 0;
                  if (e) {
                    let e = null;
                    for (let r = 0; r < t.transactions.length; r++) {
                      const n = t.transactions[r];
                      if (null == n.blockNumber) n.confirmations = 0;
                      else if (null == n.confirmations) {
                        null == e &&
                          (e = yield this._getInternalBlockNumber(
                            100 + 2 * this.pollingInterval,
                          ));
                        let t = e - n.blockNumber + 1;
                        t <= 0 && (t = 1), (n.confirmations = t);
                      }
                    }
                    const r = this.formatter.blockWithTransactions(t);
                    return (
                      (r.transactions = r.transactions.map((t) =>
                        this._wrapTransaction(t),
                      )),
                      r
                    );
                  }
                  return this.formatter.block(t);
                }),
              { oncePoll: this },
            );
          });
        }
        getBlock(t) {
          return this._getBlock(t, !1);
        }
        getBlockWithTransactions(t) {
          return this._getBlock(t, !0);
        }
        getTransaction(t) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t);
            const e = { transactionHash: this.formatter.hash(t, !0) };
            return (0, d.$l)(
              () =>
                T(this, void 0, void 0, function* () {
                  const r = yield this.perform("getTransaction", e);
                  if (null == r)
                    return null == this._emitted["t:" + t] ? null : void 0;
                  const n = this.formatter.transactionResponse(r);
                  if (null == n.blockNumber) n.confirmations = 0;
                  else if (null == n.confirmations) {
                    let t =
                      (yield this._getInternalBlockNumber(
                        100 + 2 * this.pollingInterval,
                      )) -
                      n.blockNumber +
                      1;
                    t <= 0 && (t = 1), (n.confirmations = t);
                  }
                  return this._wrapTransaction(n);
                }),
              { oncePoll: this },
            );
          });
        }
        getTransactionReceipt(t) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork(), (t = yield t);
            const e = { transactionHash: this.formatter.hash(t, !0) };
            return (0, d.$l)(
              () =>
                T(this, void 0, void 0, function* () {
                  const r = yield this.perform("getTransactionReceipt", e);
                  if (null == r)
                    return null == this._emitted["t:" + t] ? null : void 0;
                  if (null == r.blockHash) return;
                  const n = this.formatter.receipt(r);
                  if (null == n.blockNumber) n.confirmations = 0;
                  else if (null == n.confirmations) {
                    let t =
                      (yield this._getInternalBlockNumber(
                        100 + 2 * this.pollingInterval,
                      )) -
                      n.blockNumber +
                      1;
                    t <= 0 && (t = 1), (n.confirmations = t);
                  }
                  return n;
                }),
              { oncePoll: this },
            );
          });
        }
        getLogs(t) {
          return T(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const e = yield (0, n.mE)({ filter: this._getFilter(t) }),
              r = yield this.perform("getLogs", e);
            return (
              r.forEach((t) => {
                null == t.removed && (t.removed = !1);
              }),
              E.arrayOf(this.formatter.filterLog.bind(this.formatter))(r)
            );
          });
        }
        getEtherPrice() {
          return T(this, void 0, void 0, function* () {
            return yield this.getNetwork(), this.perform("getEtherPrice", {});
          });
        }
        _getBlockTag(t) {
          return T(this, void 0, void 0, function* () {
            if ("number" == typeof (t = yield t) && t < 0) {
              t % 1 && R.throwArgumentError("invalid BlockTag", "blockTag", t);
              let e = yield this._getInternalBlockNumber(
                100 + 2 * this.pollingInterval,
              );
              return (e += t), e < 0 && (e = 0), this.formatter.blockTag(e);
            }
            return this.formatter.blockTag(t);
          });
        }
        getResolver(t) {
          return T(this, void 0, void 0, function* () {
            try {
              const e = yield this._getResolver(t);
              return null == e ? null : new F(this, e, t);
            } catch (t) {
              return t.code, o.Yd.errors.CALL_EXCEPTION, null;
            }
          });
        }
        _getResolver(t) {
          return T(this, void 0, void 0, function* () {
            const e = yield this.getNetwork();
            e.ensAddress ||
              R.throwError(
                "network does not support ENS",
                o.Yd.errors.UNSUPPORTED_OPERATION,
                { operation: "ENS", network: e.name },
              );
            const r = {
              to: e.ensAddress,
              data: "0x0178b8bf" + (0, p.VM)(t).substring(2),
            };
            try {
              return this.formatter.callAddress(yield this.call(r));
            } catch (t) {
              if (t.code === o.Yd.errors.CALL_EXCEPTION) return null;
              throw t;
            }
          });
        }
        resolveName(t) {
          return T(this, void 0, void 0, function* () {
            t = yield t;
            try {
              return Promise.resolve(this.formatter.address(t));
            } catch (e) {
              if ((0, a.A7)(t)) throw e;
            }
            "string" != typeof t &&
              R.throwArgumentError("invalid ENS name", "name", t);
            const e = yield this.getResolver(t);
            return e ? yield e.getAddress() : null;
          });
        }
        lookupAddress(t) {
          return T(this, void 0, void 0, function* () {
            t = yield t;
            const e =
                (t = this.formatter.address(t)).substring(2).toLowerCase() +
                ".addr.reverse",
              r = yield this._getResolver(e);
            if (!r) return null;
            let n = (0, a.lE)(
              yield this.call({
                to: r,
                data: "0x691f3431" + (0, p.VM)(e).substring(2),
              }),
            );
            if (n.length < 32 || !l.O$.from(n.slice(0, 32)).eq(32)) return null;
            if (((n = n.slice(32)), n.length < 32)) return null;
            const o = l.O$.from(n.slice(0, 32)).toNumber();
            if (((n = n.slice(32)), o > n.length)) return null;
            const s = (0, u.ZN)(n.slice(0, o));
            return (yield this.resolveName(s)) != t ? null : s;
          });
        }
        getAvatar(t) {
          return T(this, void 0, void 0, function* () {
            let e = null;
            if ((0, a.A7)(t)) {
              const r = this.formatter.address(t),
                n = r.substring(2).toLowerCase() + ".addr.reverse",
                o = yield this._getResolver(n);
              if (!o) return null;
              e = new F(this, o, "_", r);
            } else e = yield this.getResolver(t);
            const r = yield e.getAvatar();
            return null == r ? null : r.url;
          });
        }
        perform(t, e) {
          return R.throwError(
            t + " not implemented",
            o.Yd.errors.NOT_IMPLEMENTED,
            { operation: t },
          );
        }
        _startEvent(t) {
          this.polling = this._events.filter((t) => t.pollable()).length > 0;
        }
        _stopEvent(t) {
          this.polling = this._events.filter((t) => t.pollable()).length > 0;
        }
        _addEventListener(t, e, r) {
          const n = new L(O(t), e, r);
          return this._events.push(n), this._startEvent(n), this;
        }
        on(t, e) {
          return this._addEventListener(t, e, !1);
        }
        once(t, e) {
          return this._addEventListener(t, e, !0);
        }
        emit(t, ...e) {
          let r = !1,
            n = [],
            o = O(t);
          return (
            (this._events = this._events.filter(
              (t) =>
                t.tag !== o ||
                (setTimeout(() => {
                  t.listener.apply(this, e);
                }, 0),
                (r = !0),
                !t.once || (n.push(t), !1)),
            )),
            n.forEach((t) => {
              this._stopEvent(t);
            }),
            r
          );
        }
        listenerCount(t) {
          if (!t) return this._events.length;
          let e = O(t);
          return this._events.filter((t) => t.tag === e).length;
        }
        listeners(t) {
          if (null == t) return this._events.map((t) => t.listener);
          let e = O(t);
          return this._events.filter((t) => t.tag === e).map((t) => t.listener);
        }
        off(t, e) {
          if (null == e) return this.removeAllListeners(t);
          const r = [];
          let n = !1,
            o = O(t);
          return (
            (this._events = this._events.filter(
              (t) =>
                t.tag !== o ||
                t.listener != e ||
                !!n ||
                ((n = !0), r.push(t), !1),
            )),
            r.forEach((t) => {
              this._stopEvent(t);
            }),
            this
          );
        }
        removeAllListeners(t) {
          let e = [];
          if (null == t) (e = this._events), (this._events = []);
          else {
            const r = O(t);
            this._events = this._events.filter(
              (t) => t.tag !== r || (e.push(t), !1),
            );
          }
          return (
            e.forEach((t) => {
              this._stopEvent(t);
            }),
            this
          );
        }
      }
      var q = function (t, e, r, n) {
        return new (r || (r = Promise))(function (o, s) {
          function i(t) {
            try {
              a(n.next(t));
            } catch (t) {
              s(t);
            }
          }
          function l(t) {
            try {
              a(n.throw(t));
            } catch (t) {
              s(t);
            }
          }
          function a(t) {
            var e;
            t.done
              ? o(t.value)
              : ((e = t.value),
                e instanceof r
                  ? e
                  : new r(function (t) {
                      t(e);
                    })).then(i, l);
          }
          a((n = n.apply(t, e || [])).next());
        });
      };
      const W = new o.Yd(s),
        M = ["call", "estimateGas"];
      function V(t, e, r) {
        if ("call" === t && e.code === o.Yd.errors.SERVER_ERROR) {
          const t = e.error;
          if (t && t.message.match("reverted") && (0, a.A7)(t.data))
            return t.data;
          W.throwError(
            "missing revert data in call exception",
            o.Yd.errors.CALL_EXCEPTION,
            { error: e, data: "0x" },
          );
        }
        let n = e.message;
        e.code === o.Yd.errors.SERVER_ERROR &&
        e.error &&
        "string" == typeof e.error.message
          ? (n = e.error.message)
          : "string" == typeof e.body
            ? (n = e.body)
            : "string" == typeof e.responseText && (n = e.responseText),
          (n = (n || "").toLowerCase());
        const s = r.transaction || r.signedTransaction;
        throw (
          (n.match(/insufficient funds|base fee exceeds gas limit/) &&
            W.throwError(
              "insufficient funds for intrinsic transaction cost",
              o.Yd.errors.INSUFFICIENT_FUNDS,
              { error: e, method: t, transaction: s },
            ),
          n.match(/nonce too low/) &&
            W.throwError(
              "nonce has already been used",
              o.Yd.errors.NONCE_EXPIRED,
              { error: e, method: t, transaction: s },
            ),
          n.match(/replacement transaction underpriced/) &&
            W.throwError(
              "replacement fee too low",
              o.Yd.errors.REPLACEMENT_UNDERPRICED,
              { error: e, method: t, transaction: s },
            ),
          n.match(/only replay-protected/) &&
            W.throwError(
              "legacy pre-eip-155 transactions not supported",
              o.Yd.errors.UNSUPPORTED_OPERATION,
              { error: e, method: t, transaction: s },
            ),
          M.indexOf(t) >= 0 &&
            n.match(
              /gas required exceeds allowance|always failing transaction|execution reverted/,
            ) &&
            W.throwError(
              "cannot estimate gas; transaction may fail or may require manual gas limit",
              o.Yd.errors.UNPREDICTABLE_GAS_LIMIT,
              { error: e, method: t, transaction: s },
            ),
          e)
        );
      }
      function K(t) {
        return new Promise(function (e) {
          setTimeout(e, t);
        });
      }
      function j(t) {
        if (t.error) {
          const e = new Error(t.error.message);
          throw ((e.code = t.error.code), (e.data = t.error.data), e);
        }
        return t.result;
      }
      function J(t) {
        return t ? t.toLowerCase() : t;
      }
      const Q = {};
      class X extends i.E {
        constructor(t, e, r) {
          if ((W.checkNew(new.target, X), super(), t !== Q))
            throw new Error(
              "do not call the JsonRpcSigner constructor directly; use provider.getSigner",
            );
          (0, n.zG)(this, "provider", e),
            null == r && (r = 0),
            "string" == typeof r
              ? ((0, n.zG)(
                  this,
                  "_address",
                  this.provider.formatter.address(r),
                ),
                (0, n.zG)(this, "_index", null))
              : "number" == typeof r
                ? ((0, n.zG)(this, "_index", r),
                  (0, n.zG)(this, "_address", null))
                : W.throwArgumentError(
                    "invalid address or index",
                    "addressOrIndex",
                    r,
                  );
        }
        connect(t) {
          return W.throwError(
            "cannot alter JSON-RPC Signer connection",
            o.Yd.errors.UNSUPPORTED_OPERATION,
            { operation: "connect" },
          );
        }
        connectUnchecked() {
          return new Z(Q, this.provider, this._address || this._index);
        }
        getAddress() {
          return this._address
            ? Promise.resolve(this._address)
            : this.provider
                .send("eth_accounts", [])
                .then(
                  (t) => (
                    t.length <= this._index &&
                      W.throwError(
                        "unknown account #" + this._index,
                        o.Yd.errors.UNSUPPORTED_OPERATION,
                        { operation: "getAddress" },
                      ),
                    this.provider.formatter.address(t[this._index])
                  ),
                );
        }
        sendUncheckedTransaction(t) {
          t = (0, n.DC)(t);
          const e = this.getAddress().then(
            (t) => (t && (t = t.toLowerCase()), t),
          );
          if (null == t.gasLimit) {
            const r = (0, n.DC)(t);
            (r.from = e), (t.gasLimit = this.provider.estimateGas(r));
          }
          return (
            null != t.to &&
              (t.to = Promise.resolve(t.to).then((t) =>
                q(this, void 0, void 0, function* () {
                  if (null == t) return null;
                  const e = yield this.provider.resolveName(t);
                  return (
                    null == e &&
                      W.throwArgumentError(
                        "provided ENS name resolves to null",
                        "tx.to",
                        t,
                      ),
                    e
                  );
                }),
              )),
            (0, n.mE)({ tx: (0, n.mE)(t), sender: e }).then(
              ({ tx: e, sender: r }) => {
                null != e.from
                  ? e.from.toLowerCase() !== r &&
                    W.throwArgumentError(
                      "from address mismatch",
                      "transaction",
                      t,
                    )
                  : (e.from = r);
                const n = this.provider.constructor.hexlifyTransaction(e, {
                  from: !0,
                });
                return this.provider.send("eth_sendTransaction", [n]).then(
                  (t) => t,
                  (t) => V("sendTransaction", t, n),
                );
              },
            )
          );
        }
        signTransaction(t) {
          return W.throwError(
            "signing transactions is unsupported",
            o.Yd.errors.UNSUPPORTED_OPERATION,
            { operation: "signTransaction" },
          );
        }
        sendTransaction(t) {
          return q(this, void 0, void 0, function* () {
            const e = yield this.provider._getInternalBlockNumber(
                100 + 2 * this.provider.pollingInterval,
              ),
              r = yield this.sendUncheckedTransaction(t);
            try {
              return yield (0, d.$l)(
                () =>
                  q(this, void 0, void 0, function* () {
                    const t = yield this.provider.getTransaction(r);
                    if (null !== t)
                      return this.provider._wrapTransaction(t, r, e);
                  }),
                { oncePoll: this.provider },
              );
            } catch (t) {
              throw ((t.transactionHash = r), t);
            }
          });
        }
        signMessage(t) {
          return q(this, void 0, void 0, function* () {
            const e = "string" == typeof t ? (0, u.Y0)(t) : t,
              r = yield this.getAddress();
            return yield this.provider.send("personal_sign", [
              (0, a.Dv)(e),
              r.toLowerCase(),
            ]);
          });
        }
        _legacySignMessage(t) {
          return q(this, void 0, void 0, function* () {
            const e = "string" == typeof t ? (0, u.Y0)(t) : t,
              r = yield this.getAddress();
            return yield this.provider.send("eth_sign", [
              r.toLowerCase(),
              (0, a.Dv)(e),
            ]);
          });
        }
        _signTypedData(t, e, r) {
          return q(this, void 0, void 0, function* () {
            const n = yield c.E.resolveNames(t, e, r, (t) =>
                this.provider.resolveName(t),
              ),
              o = yield this.getAddress();
            return yield this.provider.send("eth_signTypedData_v4", [
              o.toLowerCase(),
              JSON.stringify(c.E.getPayload(n.domain, e, n.value)),
            ]);
          });
        }
        unlock(t) {
          return q(this, void 0, void 0, function* () {
            const e = this.provider,
              r = yield this.getAddress();
            return e.send("personal_unlockAccount", [r.toLowerCase(), t, null]);
          });
        }
      }
      class Z extends X {
        sendTransaction(t) {
          return this.sendUncheckedTransaction(t).then((t) => ({
            hash: t,
            nonce: null,
            gasLimit: null,
            gasPrice: null,
            data: null,
            value: null,
            chainId: null,
            confirmations: 0,
            from: null,
            wait: (e) => this.provider.waitForTransaction(t, e),
          }));
        }
      }
      const tt = {
        chainId: !0,
        data: !0,
        gasLimit: !0,
        gasPrice: !0,
        nonce: !0,
        to: !0,
        value: !0,
        type: !0,
        accessList: !0,
        maxFeePerGas: !0,
        maxPriorityFeePerGas: !0,
      };
      class et extends z {
        constructor(t, e) {
          W.checkNew(new.target, et);
          let r = e;
          null == r &&
            (r = new Promise((t, e) => {
              setTimeout(() => {
                this.detectNetwork().then(
                  (e) => {
                    t(e);
                  },
                  (t) => {
                    e(t);
                  },
                );
              }, 0);
            })),
            super(r),
            t || (t = (0, n.tu)(this.constructor, "defaultUrl")()),
            "string" == typeof t
              ? (0, n.zG)(this, "connection", Object.freeze({ url: t }))
              : (0, n.zG)(this, "connection", Object.freeze((0, n.DC)(t))),
            (this._nextId = 42);
        }
        get _cache() {
          return (
            null == this._eventLoopCache && (this._eventLoopCache = {}),
            this._eventLoopCache
          );
        }
        static defaultUrl() {
          return "http://localhost:8545";
        }
        detectNetwork() {
          return (
            this._cache.detectNetwork ||
              ((this._cache.detectNetwork = this._uncachedDetectNetwork()),
              setTimeout(() => {
                this._cache.detectNetwork = null;
              }, 0)),
            this._cache.detectNetwork
          );
        }
        _uncachedDetectNetwork() {
          return q(this, void 0, void 0, function* () {
            yield K(0);
            let t = null;
            try {
              t = yield this.send("eth_chainId", []);
            } catch (e) {
              try {
                t = yield this.send("net_version", []);
              } catch (t) {}
            }
            if (null != t) {
              const e = (0, n.tu)(this.constructor, "getNetwork");
              try {
                return e(l.O$.from(t).toNumber());
              } catch (e) {
                return W.throwError(
                  "could not detect network",
                  o.Yd.errors.NETWORK_ERROR,
                  { chainId: t, event: "invalidNetwork", serverError: e },
                );
              }
            }
            return W.throwError(
              "could not detect network",
              o.Yd.errors.NETWORK_ERROR,
              { event: "noNetwork" },
            );
          });
        }
        getSigner(t) {
          return new X(Q, this, t);
        }
        getUncheckedSigner(t) {
          return this.getSigner(t).connectUnchecked();
        }
        listAccounts() {
          return this.send("eth_accounts", []).then((t) =>
            t.map((t) => this.formatter.address(t)),
          );
        }
        send(t, e) {
          const r = {
            method: t,
            params: e,
            id: this._nextId++,
            jsonrpc: "2.0",
          };
          this.emit("debug", {
            action: "request",
            request: (0, n.p$)(r),
            provider: this,
          });
          const o = ["eth_chainId", "eth_blockNumber"].indexOf(t) >= 0;
          if (o && this._cache[t]) return this._cache[t];
          const s = (0, d.rd)(this.connection, JSON.stringify(r), j).then(
            (t) => (
              this.emit("debug", {
                action: "response",
                request: r,
                response: t,
                provider: this,
              }),
              t
            ),
            (t) => {
              throw (
                (this.emit("debug", {
                  action: "response",
                  error: t,
                  request: r,
                  provider: this,
                }),
                t)
              );
            },
          );
          return (
            o &&
              ((this._cache[t] = s),
              setTimeout(() => {
                this._cache[t] = null;
              }, 0)),
            s
          );
        }
        prepareRequest(t, e) {
          switch (t) {
            case "getBlockNumber":
              return ["eth_blockNumber", []];
            case "getGasPrice":
              return ["eth_gasPrice", []];
            case "getBalance":
              return ["eth_getBalance", [J(e.address), e.blockTag]];
            case "getTransactionCount":
              return ["eth_getTransactionCount", [J(e.address), e.blockTag]];
            case "getCode":
              return ["eth_getCode", [J(e.address), e.blockTag]];
            case "getStorageAt":
              return [
                "eth_getStorageAt",
                [J(e.address), e.position, e.blockTag],
              ];
            case "sendTransaction":
              return ["eth_sendRawTransaction", [e.signedTransaction]];
            case "getBlock":
              return e.blockTag
                ? [
                    "eth_getBlockByNumber",
                    [e.blockTag, !!e.includeTransactions],
                  ]
                : e.blockHash
                  ? [
                      "eth_getBlockByHash",
                      [e.blockHash, !!e.includeTransactions],
                    ]
                  : null;
            case "getTransaction":
              return ["eth_getTransactionByHash", [e.transactionHash]];
            case "getTransactionReceipt":
              return ["eth_getTransactionReceipt", [e.transactionHash]];
            case "call":
              return [
                "eth_call",
                [
                  (0, n.tu)(this.constructor, "hexlifyTransaction")(
                    e.transaction,
                    { from: !0 },
                  ),
                  e.blockTag,
                ],
              ];
            case "estimateGas":
              return [
                "eth_estimateGas",
                [
                  (0, n.tu)(this.constructor, "hexlifyTransaction")(
                    e.transaction,
                    { from: !0 },
                  ),
                ],
              ];
            case "getLogs":
              return (
                e.filter &&
                  null != e.filter.address &&
                  (e.filter.address = J(e.filter.address)),
                ["eth_getLogs", [e.filter]]
              );
          }
          return null;
        }
        perform(t, e) {
          return q(this, void 0, void 0, function* () {
            if ("call" === t || "estimateGas" === t) {
              const t = e.transaction;
              if (
                t &&
                null != t.type &&
                l.O$.from(t.type).isZero() &&
                null == t.maxFeePerGas &&
                null == t.maxPriorityFeePerGas
              ) {
                const r = yield this.getFeeData();
                null == r.maxFeePerGas &&
                  null == r.maxPriorityFeePerGas &&
                  (((e = (0, n.DC)(e)).transaction = (0, n.DC)(t)),
                  delete e.transaction.type);
              }
            }
            const r = this.prepareRequest(t, e);
            null == r &&
              W.throwError(
                t + " not implemented",
                o.Yd.errors.NOT_IMPLEMENTED,
                { operation: t },
              );
            try {
              return yield this.send(r[0], r[1]);
            } catch (r) {
              return V(t, r, e);
            }
          });
        }
        _startEvent(t) {
          "pending" === t.tag && this._startPending(), super._startEvent(t);
        }
        _startPending() {
          if (null != this._pendingFilter) return;
          const t = this,
            e = this.send("eth_newPendingTransactionFilter", []);
          (this._pendingFilter = e),
            e
              .then(function (r) {
                return (
                  (function n() {
                    t.send("eth_getFilterChanges", [r])
                      .then(function (r) {
                        if (t._pendingFilter != e) return null;
                        let n = Promise.resolve();
                        return (
                          r.forEach(function (e) {
                            (t._emitted["t:" + e.toLowerCase()] = "pending"),
                              (n = n.then(function () {
                                return t.getTransaction(e).then(function (e) {
                                  return t.emit("pending", e), null;
                                });
                              }));
                          }),
                          n.then(function () {
                            return K(1e3);
                          })
                        );
                      })
                      .then(function () {
                        if (t._pendingFilter == e)
                          return (
                            setTimeout(function () {
                              n();
                            }, 0),
                            null
                          );
                        t.send("eth_uninstallFilter", [r]);
                      })
                      .catch((t) => {});
                  })(),
                  r
                );
              })
              .catch((t) => {});
        }
        _stopEvent(t) {
          "pending" === t.tag &&
            0 === this.listenerCount("pending") &&
            (this._pendingFilter = null),
            super._stopEvent(t);
        }
        static hexlifyTransaction(t, e) {
          const r = (0, n.DC)(tt);
          if (e) for (const t in e) e[t] && (r[t] = !0);
          (0, n.uj)(t, r);
          const o = {};
          return (
            [
              "gasLimit",
              "gasPrice",
              "type",
              "maxFeePerGas",
              "maxPriorityFeePerGas",
              "nonce",
              "value",
            ].forEach(function (e) {
              if (null == t[e]) return;
              const r = (0, a.$P)(t[e]);
              "gasLimit" === e && (e = "gas"), (o[e] = r);
            }),
            ["from", "to", "data"].forEach(function (e) {
              null != t[e] && (o[e] = (0, a.Dv)(t[e]));
            }),
            t.accessList && (o.accessList = (0, h.z7)(t.accessList)),
            o
          );
        }
      }
      const rt = new o.Yd(s);
      class nt extends et {
        detectNetwork() {
          const t = Object.create(null, {
            detectNetwork: { get: () => super.detectNetwork },
          });
          return (
            (e = this),
            (r = void 0),
            (i = function* () {
              let e = this.network;
              return (
                null == e &&
                  ((e = yield t.detectNetwork.call(this)),
                  e ||
                    rt.throwError(
                      "no network detected",
                      o.Yd.errors.UNKNOWN_ERROR,
                      {},
                    ),
                  null == this._network &&
                    ((0, n.zG)(this, "_network", e),
                    this.emit("network", e, null))),
                e
              );
            }),
            new ((s = void 0) || (s = Promise))(function (t, n) {
              function o(t) {
                try {
                  a(i.next(t));
                } catch (t) {
                  n(t);
                }
              }
              function l(t) {
                try {
                  a(i.throw(t));
                } catch (t) {
                  n(t);
                }
              }
              function a(e) {
                var r;
                e.done
                  ? t(e.value)
                  : ((r = e.value),
                    r instanceof s
                      ? r
                      : new s(function (t) {
                          t(r);
                        })).then(o, l);
              }
              a((i = i.apply(e, r || [])).next());
            })
          );
          var e, r, s, i;
        }
      }
      new o.Yd(s);
    },
  },
]);
