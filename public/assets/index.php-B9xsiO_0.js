var ce = Object.defineProperty;
var ae = (t, e, s) => (e in t ? ce(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : (t[e] = s));
var O = (t, e, s) => ae(t, typeof e != 'symbol' ? e + '' : e, s);
(function () {
    const e = document.createElement('link').relList;
    if (e && e.supports && e.supports('modulepreload')) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
    new MutationObserver(i => {
        for (const r of i) if (r.type === 'childList') for (const o of r.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && n(o);
    }).observe(document, { childList: !0, subtree: !0 });
    function s(i) {
        const r = {};
        return (
            i.integrity && (r.integrity = i.integrity),
            i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy),
            i.crossOrigin === 'use-credentials'
                ? (r.credentials = 'include')
                : i.crossOrigin === 'anonymous'
                  ? (r.credentials = 'omit')
                  : (r.credentials = 'same-origin'),
            r
        );
    }
    function n(i) {
        if (i.ep) return;
        i.ep = !0;
        const r = s(i);
        fetch(i.href, r);
    }
})();
class ue {
    constructor({ type: e, latest_price: s, id: n }) {
        O(this, 'name', '');
        O(this, 'fetchedPrice', 0);
        O(this, 'inputPrice', 0);
        O(this, 'id', '');
        (this.name = e), (this.fetchedPrice = parseFloat(s.price)), (this.id = n);
    }
    get isGreater() {
        return this.id.includes('greater');
    }
    addInput() {
        this.inputPrice = this.fetchedPrice;
        const e = document.querySelector('[data-essences]'),
            s = document.querySelector('[data-buy-type]');
        e &&
            s &&
            ((e.innerHTML += `
                <label class="essence" data-essence="${this.id}">
                    ${this.name}
                    <input type="number" name="${this.id}" value="${this.fetchedPrice}">
                </label>
            `),
            (s.innerHTML += `
                <option value="${this.id}">${this.name}</option>
            `));
    }
    addInputListener() {
        const e = document.querySelector(`[data-essence="${this.id}"]`);
        e &&
            e.addEventListener('change', s => {
                const n = s.target;
                this.inputPrice = parseFloat(n.value);
            });
    }
}
class fe {
    constructor(e) {
        O(this, 'url');
        O(this, 'priceData', null);
        O(this, 'essences', []);
        this.url = e;
    }
    async fetchData() {
        await this.fetchPrices(), this.createEssences();
    }
    async fetchPrices() {
        try {
            const e = await fetch(this.url);
            if (!e.ok) {
                console.error(e);
                return;
            }
            this.priceData = await e.json();
        } catch (e) {
            console.error(e.message);
        }
    }
    createEssences() {
        this.priceData &&
            (this.priceData.items.forEach(e => this.essences.push(new ue(e))),
            (this.essences = this.essences.sort((e, s) => e.id.localeCompare(s.id))),
            this.essences.forEach(e => e.addInput()),
            this.essences.forEach(e => e.addInputListener()));
    }
}
var G = 1e9,
    le = {
        precision: 20,
        rounding: 4,
        toExpNeg: -7,
        toExpPos: 21,
        LN10: '2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286',
    },
    Y,
    v = !0,
    q = '[DecimalError] ',
    V = q + 'Invalid argument: ',
    Q = q + 'Exponent out of range: ',
    U = Math.floor,
    k = Math.pow,
    he = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
    S,
    L = 1e7,
    m = 7,
    te = 9007199254740991,
    j = U(te / m),
    f = {};
f.absoluteValue = f.abs = function () {
    var t = new this.constructor(this);
    return t.s && (t.s = 1), t;
};
f.comparedTo = f.cmp = function (t) {
    var e,
        s,
        n,
        i,
        r = this;
    if (((t = new r.constructor(t)), r.s !== t.s)) return r.s || -t.s;
    if (r.e !== t.e) return (r.e > t.e) ^ (r.s < 0) ? 1 : -1;
    for (n = r.d.length, i = t.d.length, e = 0, s = n < i ? n : i; e < s; ++e) if (r.d[e] !== t.d[e]) return (r.d[e] > t.d[e]) ^ (r.s < 0) ? 1 : -1;
    return n === i ? 0 : (n > i) ^ (r.s < 0) ? 1 : -1;
};
f.decimalPlaces = f.dp = function () {
    var t = this,
        e = t.d.length - 1,
        s = (e - t.e) * m;
    if (((e = t.d[e]), e)) for (; e % 10 == 0; e /= 10) s--;
    return s < 0 ? 0 : s;
};
f.dividedBy = f.div = function (t) {
    return A(this, new this.constructor(t));
};
f.dividedToIntegerBy = f.idiv = function (t) {
    var e = this,
        s = e.constructor;
    return p(A(e, new s(t), 0, 1), s.precision);
};
f.equals = f.eq = function (t) {
    return !this.cmp(t);
};
f.exponent = function () {
    return P(this);
};
f.greaterThan = f.gt = function (t) {
    return this.cmp(t) > 0;
};
f.greaterThanOrEqualTo = f.gte = function (t) {
    return this.cmp(t) >= 0;
};
f.isInteger = f.isint = function () {
    return this.e > this.d.length - 2;
};
f.isNegative = f.isneg = function () {
    return this.s < 0;
};
f.isPositive = f.ispos = function () {
    return this.s > 0;
};
f.isZero = function () {
    return this.s === 0;
};
f.lessThan = f.lt = function (t) {
    return this.cmp(t) < 0;
};
f.lessThanOrEqualTo = f.lte = function (t) {
    return this.cmp(t) < 1;
};
f.logarithm = f.log = function (t) {
    var e,
        s = this,
        n = s.constructor,
        i = n.precision,
        r = i + 5;
    if (t === void 0) t = new n(10);
    else if (((t = new n(t)), t.s < 1 || t.eq(S))) throw Error(q + 'NaN');
    if (s.s < 1) throw Error(q + (s.s ? 'NaN' : '-Infinity'));
    return s.eq(S) ? new n(0) : ((v = !1), (e = A(y(s, r), y(t, r), r)), (v = !0), p(e, i));
};
f.minus = f.sub = function (t) {
    var e = this;
    return (t = new e.constructor(t)), e.s == t.s ? ie(e, t) : re(e, ((t.s = -t.s), t));
};
f.modulo = f.mod = function (t) {
    var e,
        s = this,
        n = s.constructor,
        i = n.precision;
    if (((t = new n(t)), !t.s)) throw Error(q + 'NaN');
    return s.s ? ((v = !1), (e = A(s, t, 0, 1).times(t)), (v = !0), s.minus(e)) : p(new n(s), i);
};
f.naturalExponential = f.exp = function () {
    return ne(this);
};
f.naturalLogarithm = f.ln = function () {
    return y(this);
};
f.negated = f.neg = function () {
    var t = new this.constructor(this);
    return (t.s = -t.s || 0), t;
};
f.plus = f.add = function (t) {
    var e = this;
    return (t = new e.constructor(t)), e.s == t.s ? re(e, t) : ie(e, ((t.s = -t.s), t));
};
f.precision = f.sd = function (t) {
    var e,
        s,
        n,
        i = this;
    if (t !== void 0 && t !== !!t && t !== 1 && t !== 0) throw Error(V + t);
    if (((e = P(i) + 1), (n = i.d.length - 1), (s = n * m + 1), (n = i.d[n]), n)) {
        for (; n % 10 == 0; n /= 10) s--;
        for (n = i.d[0]; n >= 10; n /= 10) s++;
    }
    return t && e > s ? e : s;
};
f.squareRoot = f.sqrt = function () {
    var t,
        e,
        s,
        n,
        i,
        r,
        o,
        c = this,
        a = c.constructor;
    if (c.s < 1) {
        if (!c.s) return new a(0);
        throw Error(q + 'NaN');
    }
    for (
        t = P(c),
            v = !1,
            i = Math.sqrt(+c),
            i == 0 || i == 1 / 0
                ? ((e = I(c.d)),
                  (e.length + t) % 2 == 0 && (e += '0'),
                  (i = Math.sqrt(e)),
                  (t = U((t + 1) / 2) - (t < 0 || t % 2)),
                  i == 1 / 0 ? (e = '5e' + t) : ((e = i.toExponential()), (e = e.slice(0, e.indexOf('e') + 1) + t)),
                  (n = new a(e)))
                : (n = new a(i.toString())),
            s = a.precision,
            i = o = s + 3;
        ;

    )
        if (((r = n), (n = r.plus(A(c, r, o + 2)).times(0.5)), I(r.d).slice(0, o) === (e = I(n.d)).slice(0, o))) {
            if (((e = e.slice(o - 3, o + 1)), i == o && e == '4999')) {
                if ((p(r, s + 1, 0), r.times(r).eq(c))) {
                    n = r;
                    break;
                }
            } else if (e != '9999') break;
            o += 4;
        }
    return (v = !0), p(n, s);
};
f.times = f.mul = function (t) {
    var e,
        s,
        n,
        i,
        r,
        o,
        c,
        a,
        l,
        u = this,
        h = u.constructor,
        E = u.d,
        d = (t = new h(t)).d;
    if (!u.s || !t.s) return new h(0);
    for (
        t.s *= u.s,
            s = u.e + t.e,
            a = E.length,
            l = d.length,
            a < l && ((r = E), (E = d), (d = r), (o = a), (a = l), (l = o)),
            r = [],
            o = a + l,
            n = o;
        n--;

    )
        r.push(0);
    for (n = l; --n >= 0; ) {
        for (e = 0, i = a + n; i > n; ) (c = r[i] + d[n] * E[i - n - 1] + e), (r[i--] = c % L | 0), (e = (c / L) | 0);
        r[i] = (r[i] + e) % L | 0;
    }
    for (; !r[--o]; ) r.pop();
    return e ? ++s : r.shift(), (t.d = r), (t.e = s), v ? p(t, h.precision) : t;
};
f.toDecimalPlaces = f.todp = function (t, e) {
    var s = this,
        n = s.constructor;
    return (s = new n(s)), t === void 0 ? s : (b(t, 0, G), e === void 0 ? (e = n.rounding) : b(e, 0, 8), p(s, t + P(s) + 1, e));
};
f.toExponential = function (t, e) {
    var s,
        n = this,
        i = n.constructor;
    return (
        t === void 0
            ? (s = H(n, !0))
            : (b(t, 0, G), e === void 0 ? (e = i.rounding) : b(e, 0, 8), (n = p(new i(n), t + 1, e)), (s = H(n, !0, t + 1))),
        s
    );
};
f.toFixed = function (t, e) {
    var s,
        n,
        i = this,
        r = i.constructor;
    return t === void 0
        ? H(i)
        : (b(t, 0, G),
          e === void 0 ? (e = r.rounding) : b(e, 0, 8),
          (n = p(new r(i), t + P(i) + 1, e)),
          (s = H(n.abs(), !1, t + P(n) + 1)),
          i.isneg() && !i.isZero() ? '-' + s : s);
};
f.toInteger = f.toint = function () {
    var t = this,
        e = t.constructor;
    return p(new e(t), P(t) + 1, e.rounding);
};
f.toNumber = function () {
    return +this;
};
f.toPower = f.pow = function (t) {
    var e,
        s,
        n,
        i,
        r,
        o,
        c = this,
        a = c.constructor,
        l = 12,
        u = +(t = new a(t));
    if (!t.s) return new a(S);
    if (((c = new a(c)), !c.s)) {
        if (t.s < 1) throw Error(q + 'Infinity');
        return c;
    }
    if (c.eq(S)) return c;
    if (((n = a.precision), t.eq(S))) return p(c, n);
    if (((e = t.e), (s = t.d.length - 1), (o = e >= s), (r = c.s), o)) {
        if ((s = u < 0 ? -u : u) <= te) {
            for (i = new a(S), e = Math.ceil(n / m + 4), v = !1; s % 2 && ((i = i.times(c)), ee(i.d, e)), (s = U(s / 2)), s !== 0; )
                (c = c.times(c)), ee(c.d, e);
            return (v = !0), t.s < 0 ? new a(S).div(i) : p(i, n);
        }
    } else if (r < 0) throw Error(q + 'NaN');
    return (r = r < 0 && t.d[Math.max(e, s)] & 1 ? -1 : 1), (c.s = 1), (v = !1), (i = t.times(y(c, n + l))), (v = !0), (i = ne(i)), (i.s = r), i;
};
f.toPrecision = function (t, e) {
    var s,
        n,
        i = this,
        r = i.constructor;
    return (
        t === void 0
            ? ((s = P(i)), (n = H(i, s <= r.toExpNeg || s >= r.toExpPos)))
            : (b(t, 1, G),
              e === void 0 ? (e = r.rounding) : b(e, 0, 8),
              (i = p(new r(i), t, e)),
              (s = P(i)),
              (n = H(i, t <= s || s <= r.toExpNeg, t))),
        n
    );
};
f.toSignificantDigits = f.tosd = function (t, e) {
    var s = this,
        n = s.constructor;
    return t === void 0 ? ((t = n.precision), (e = n.rounding)) : (b(t, 1, G), e === void 0 ? (e = n.rounding) : b(e, 0, 8)), p(new n(s), t, e);
};
f.toString =
    f.valueOf =
    f.val =
    f.toJSON =
    f[Symbol.for('nodejs.util.inspect.custom')] =
        function () {
            var t = this,
                e = P(t),
                s = t.constructor;
            return H(t, e <= s.toExpNeg || e >= s.toExpPos);
        };
function re(t, e) {
    var s,
        n,
        i,
        r,
        o,
        c,
        a,
        l,
        u = t.constructor,
        h = u.precision;
    if (!t.s || !e.s) return e.s || (e = new u(t)), v ? p(e, h) : e;
    if (((a = t.d), (l = e.d), (o = t.e), (i = e.e), (a = a.slice()), (r = o - i), r)) {
        for (
            r < 0 ? ((n = a), (r = -r), (c = l.length)) : ((n = l), (i = o), (c = a.length)),
                o = Math.ceil(h / m),
                c = o > c ? o + 1 : c + 1,
                r > c && ((r = c), (n.length = 1)),
                n.reverse();
            r--;

        )
            n.push(0);
        n.reverse();
    }
    for (c = a.length, r = l.length, c - r < 0 && ((r = c), (n = l), (l = a), (a = n)), s = 0; r; )
        (s = ((a[--r] = a[r] + l[r] + s) / L) | 0), (a[r] %= L);
    for (s && (a.unshift(s), ++i), c = a.length; a[--c] == 0; ) a.pop();
    return (e.d = a), (e.e = i), v ? p(e, h) : e;
}
function b(t, e, s) {
    if (t !== ~~t || t < e || t > s) throw Error(V + t);
}
function I(t) {
    var e,
        s,
        n,
        i = t.length - 1,
        r = '',
        o = t[0];
    if (i > 0) {
        for (r += o, e = 1; e < i; e++) (n = t[e] + ''), (s = m - n.length), s && (r += R(s)), (r += n);
        (o = t[e]), (n = o + ''), (s = m - n.length), s && (r += R(s));
    } else if (o === 0) return '0';
    for (; o % 10 === 0; ) o /= 10;
    return r + o;
}
var A = (function () {
    function t(n, i) {
        var r,
            o = 0,
            c = n.length;
        for (n = n.slice(); c--; ) (r = n[c] * i + o), (n[c] = r % L | 0), (o = (r / L) | 0);
        return o && n.unshift(o), n;
    }
    function e(n, i, r, o) {
        var c, a;
        if (r != o) a = r > o ? 1 : -1;
        else
            for (c = a = 0; c < r; c++)
                if (n[c] != i[c]) {
                    a = n[c] > i[c] ? 1 : -1;
                    break;
                }
        return a;
    }
    function s(n, i, r) {
        for (var o = 0; r--; ) (n[r] -= o), (o = n[r] < i[r] ? 1 : 0), (n[r] = o * L + n[r] - i[r]);
        for (; !n[0] && n.length > 1; ) n.shift();
    }
    return function (n, i, r, o) {
        var c,
            a,
            l,
            u,
            h,
            E,
            d,
            x,
            g,
            w,
            _,
            D,
            $,
            B,
            W,
            J,
            C,
            X,
            Z = n.constructor,
            oe = n.s == i.s ? 1 : -1,
            M = n.d,
            N = i.d;
        if (!n.s) return new Z(n);
        if (!i.s) throw Error(q + 'Division by zero');
        for (a = n.e - i.e, C = N.length, W = M.length, d = new Z(oe), x = d.d = [], l = 0; N[l] == (M[l] || 0); ) ++l;
        if ((N[l] > (M[l] || 0) && --a, r == null ? (D = r = Z.precision) : o ? (D = r + (P(n) - P(i)) + 1) : (D = r), D < 0)) return new Z(0);
        if (((D = (D / m + 2) | 0), (l = 0), C == 1))
            for (u = 0, N = N[0], D++; (l < W || u) && D--; l++) ($ = u * L + (M[l] || 0)), (x[l] = ($ / N) | 0), (u = $ % N | 0);
        else {
            for (
                u = (L / (N[0] + 1)) | 0,
                    u > 1 && ((N = t(N, u)), (M = t(M, u)), (C = N.length), (W = M.length)),
                    B = C,
                    g = M.slice(0, C),
                    w = g.length;
                w < C;

            )
                g[w++] = 0;
            (X = N.slice()), X.unshift(0), (J = N[0]), N[1] >= L / 2 && ++J;
            do
                (u = 0),
                    (c = e(N, g, C, w)),
                    c < 0
                        ? ((_ = g[0]),
                          C != w && (_ = _ * L + (g[1] || 0)),
                          (u = (_ / J) | 0),
                          u > 1
                              ? (u >= L && (u = L - 1),
                                (h = t(N, u)),
                                (E = h.length),
                                (w = g.length),
                                (c = e(h, g, E, w)),
                                c == 1 && (u--, s(h, C < E ? X : N, E)))
                              : (u == 0 && (c = u = 1), (h = N.slice())),
                          (E = h.length),
                          E < w && h.unshift(0),
                          s(g, h, w),
                          c == -1 && ((w = g.length), (c = e(N, g, C, w)), c < 1 && (u++, s(g, C < w ? X : N, w))),
                          (w = g.length))
                        : c === 0 && (u++, (g = [0])),
                    (x[l++] = u),
                    c && g[0] ? (g[w++] = M[B] || 0) : ((g = [M[B]]), (w = 1));
            while ((B++ < W || g[0] !== void 0) && D--);
        }
        return x[0] || x.shift(), (d.e = a), p(d, o ? r + P(d) + 1 : r);
    };
})();
function ne(t, e) {
    var s,
        n,
        i,
        r,
        o,
        c,
        a = 0,
        l = 0,
        u = t.constructor,
        h = u.precision;
    if (P(t) > 16) throw Error(Q + P(t));
    if (!t.s) return new u(S);
    for (v = !1, c = h, o = new u(0.03125); t.abs().gte(0.1); ) (t = t.times(o)), (l += 5);
    for (n = ((Math.log(k(2, l)) / Math.LN10) * 2 + 5) | 0, c += n, s = i = r = new u(S), u.precision = c; ; ) {
        if (((i = p(i.times(t), c)), (s = s.times(++a)), (o = r.plus(A(i, s, c))), I(o.d).slice(0, c) === I(r.d).slice(0, c))) {
            for (; l--; ) r = p(r.times(r), c);
            return (u.precision = h), e == null ? ((v = !0), p(r, h)) : r;
        }
        r = o;
    }
}
function P(t) {
    for (var e = t.e * m, s = t.d[0]; s >= 10; s /= 10) e++;
    return e;
}
function K(t, e, s) {
    if (e > t.LN10.sd()) throw ((v = !0), s && (t.precision = s), Error(q + 'LN10 precision limit exceeded'));
    return p(new t(t.LN10), e);
}
function R(t) {
    for (var e = ''; t--; ) e += '0';
    return e;
}
function y(t, e) {
    var s,
        n,
        i,
        r,
        o,
        c,
        a,
        l,
        u,
        h = 1,
        E = 10,
        d = t,
        x = d.d,
        g = d.constructor,
        w = g.precision;
    if (d.s < 1) throw Error(q + (d.s ? 'NaN' : '-Infinity'));
    if (d.eq(S)) return new g(0);
    if ((e == null ? ((v = !1), (l = w)) : (l = e), d.eq(10))) return e == null && (v = !0), K(g, l);
    if (((l += E), (g.precision = l), (s = I(x)), (n = s.charAt(0)), (r = P(d)), Math.abs(r) < 15e14)) {
        for (; (n < 7 && n != 1) || (n == 1 && s.charAt(1) > 3); ) (d = d.times(t)), (s = I(d.d)), (n = s.charAt(0)), h++;
        (r = P(d)), n > 1 ? ((d = new g('0.' + s)), r++) : (d = new g(n + '.' + s.slice(1)));
    } else
        return (
            (a = K(g, l + 2, w).times(r + '')),
            (d = y(new g(n + '.' + s.slice(1)), l - E).plus(a)),
            (g.precision = w),
            e == null ? ((v = !0), p(d, w)) : d
        );
    for (c = o = d = A(d.minus(S), d.plus(S), l), u = p(d.times(d), l), i = 3; ; ) {
        if (((o = p(o.times(u), l)), (a = c.plus(A(o, new g(i), l))), I(a.d).slice(0, l) === I(c.d).slice(0, l)))
            return (
                (c = c.times(2)),
                r !== 0 && (c = c.plus(K(g, l + 2, w).times(r + ''))),
                (c = A(c, new g(h), l)),
                (g.precision = w),
                e == null ? ((v = !0), p(c, w)) : c
            );
        (c = a), (i += 2);
    }
}
function z(t, e) {
    var s, n, i;
    for (
        (s = e.indexOf('.')) > -1 && (e = e.replace('.', '')),
            (n = e.search(/e/i)) > 0 ? (s < 0 && (s = n), (s += +e.slice(n + 1)), (e = e.substring(0, n))) : s < 0 && (s = e.length),
            n = 0;
        e.charCodeAt(n) === 48;

    )
        ++n;
    for (i = e.length; e.charCodeAt(i - 1) === 48; ) --i;
    if (((e = e.slice(n, i)), e)) {
        if (((i -= n), (s = s - n - 1), (t.e = U(s / m)), (t.d = []), (n = (s + 1) % m), s < 0 && (n += m), n < i)) {
            for (n && t.d.push(+e.slice(0, n)), i -= m; n < i; ) t.d.push(+e.slice(n, (n += m)));
            (e = e.slice(n)), (n = m - e.length);
        } else n -= i;
        for (; n--; ) e += '0';
        if ((t.d.push(+e), v && (t.e > j || t.e < -j))) throw Error(Q + s);
    } else (t.s = 0), (t.e = 0), (t.d = [0]);
    return t;
}
function p(t, e, s) {
    var n,
        i,
        r,
        o,
        c,
        a,
        l,
        u,
        h = t.d;
    for (o = 1, r = h[0]; r >= 10; r /= 10) o++;
    if (((n = e - o), n < 0)) (n += m), (i = e), (l = h[(u = 0)]);
    else {
        if (((u = Math.ceil((n + 1) / m)), (r = h.length), u >= r)) return t;
        for (l = r = h[u], o = 1; r >= 10; r /= 10) o++;
        (n %= m), (i = n - m + o);
    }
    if (
        (s !== void 0 &&
            ((r = k(10, o - i - 1)),
            (c = (l / r) % 10 | 0),
            (a = e < 0 || h[u + 1] !== void 0 || l % r),
            (a =
                s < 4
                    ? (c || a) && (s == 0 || s == (t.s < 0 ? 3 : 2))
                    : c > 5 ||
                      (c == 5 &&
                          (s == 4 || a || (s == 6 && (n > 0 ? (i > 0 ? l / k(10, o - i) : 0) : h[u - 1]) % 10 & 1) || s == (t.s < 0 ? 8 : 7))))),
        e < 1 || !h[0])
    )
        return (
            a
                ? ((r = P(t)), (h.length = 1), (e = e - r - 1), (h[0] = k(10, (m - (e % m)) % m)), (t.e = U(-e / m) || 0))
                : ((h.length = 1), (h[0] = t.e = t.s = 0)),
            t
        );
    if (
        (n == 0
            ? ((h.length = u), (r = 1), u--)
            : ((h.length = u + 1), (r = k(10, m - n)), (h[u] = i > 0 ? ((l / k(10, o - i)) % k(10, i) | 0) * r : 0)),
        a)
    )
        for (;;)
            if (u == 0) {
                (h[0] += r) == L && ((h[0] = 1), ++t.e);
                break;
            } else {
                if (((h[u] += r), h[u] != L)) break;
                (h[u--] = 0), (r = 1);
            }
    for (n = h.length; h[--n] === 0; ) h.pop();
    if (v && (t.e > j || t.e < -j)) throw Error(Q + P(t));
    return t;
}
function ie(t, e) {
    var s,
        n,
        i,
        r,
        o,
        c,
        a,
        l,
        u,
        h,
        E = t.constructor,
        d = E.precision;
    if (!t.s || !e.s) return e.s ? (e.s = -e.s) : (e = new E(t)), v ? p(e, d) : e;
    if (((a = t.d), (h = e.d), (n = e.e), (l = t.e), (a = a.slice()), (o = l - n), o)) {
        for (
            u = o < 0,
                u ? ((s = a), (o = -o), (c = h.length)) : ((s = h), (n = l), (c = a.length)),
                i = Math.max(Math.ceil(d / m), c) + 2,
                o > i && ((o = i), (s.length = 1)),
                s.reverse(),
                i = o;
            i--;

        )
            s.push(0);
        s.reverse();
    } else {
        for (i = a.length, c = h.length, u = i < c, u && (c = i), i = 0; i < c; i++)
            if (a[i] != h[i]) {
                u = a[i] < h[i];
                break;
            }
        o = 0;
    }
    for (u && ((s = a), (a = h), (h = s), (e.s = -e.s)), c = a.length, i = h.length - c; i > 0; --i) a[c++] = 0;
    for (i = h.length; i > o; ) {
        if (a[--i] < h[i]) {
            for (r = i; r && a[--r] === 0; ) a[r] = L - 1;
            --a[r], (a[i] += L);
        }
        a[i] -= h[i];
    }
    for (; a[--c] === 0; ) a.pop();
    for (; a[0] === 0; a.shift()) --n;
    return a[0] ? ((e.d = a), (e.e = n), v ? p(e, d) : e) : new E(0);
}
function H(t, e, s) {
    var n,
        i = P(t),
        r = I(t.d),
        o = r.length;
    return (
        e
            ? (s && (n = s - o) > 0 ? (r = r.charAt(0) + '.' + r.slice(1) + R(n)) : o > 1 && (r = r.charAt(0) + '.' + r.slice(1)),
              (r = r + (i < 0 ? 'e' : 'e+') + i))
            : i < 0
              ? ((r = '0.' + R(-i - 1) + r), s && (n = s - o) > 0 && (r += R(n)))
              : i >= o
                ? ((r += R(i + 1 - o)), s && (n = s - i - 1) > 0 && (r = r + '.' + R(n)))
                : ((n = i + 1) < o && (r = r.slice(0, n) + '.' + r.slice(n)), s && (n = s - o) > 0 && (i + 1 === o && (r += '.'), (r += R(n)))),
        t.s < 0 ? '-' + r : r
    );
}
function ee(t, e) {
    if (t.length > e) return (t.length = e), !0;
}
function se(t) {
    var e, s, n;
    function i(r) {
        var o = this;
        if (!(o instanceof i)) return new i(r);
        if (((o.constructor = i), r instanceof i)) {
            (o.s = r.s), (o.e = r.e), (o.d = (r = r.d) ? r.slice() : r);
            return;
        }
        if (typeof r == 'number') {
            if (r * 0 !== 0) throw Error(V + r);
            if (r > 0) o.s = 1;
            else if (r < 0) (r = -r), (o.s = -1);
            else {
                (o.s = 0), (o.e = 0), (o.d = [0]);
                return;
            }
            if (r === ~~r && r < 1e7) {
                (o.e = 0), (o.d = [r]);
                return;
            }
            return z(o, r.toString());
        } else if (typeof r != 'string') throw Error(V + r);
        if ((r.charCodeAt(0) === 45 ? ((r = r.slice(1)), (o.s = -1)) : (o.s = 1), he.test(r))) z(o, r);
        else throw Error(V + r);
    }
    if (
        ((i.prototype = f),
        (i.ROUND_UP = 0),
        (i.ROUND_DOWN = 1),
        (i.ROUND_CEIL = 2),
        (i.ROUND_FLOOR = 3),
        (i.ROUND_HALF_UP = 4),
        (i.ROUND_HALF_DOWN = 5),
        (i.ROUND_HALF_EVEN = 6),
        (i.ROUND_HALF_CEIL = 7),
        (i.ROUND_HALF_FLOOR = 8),
        (i.clone = se),
        (i.config = i.set = de),
        t === void 0 && (t = {}),
        t)
    )
        for (n = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'], e = 0; e < n.length; ) t.hasOwnProperty((s = n[e++])) || (t[s] = this[s]);
    return i.config(t), i;
}
function de(t) {
    if (!t || typeof t != 'object') throw Error(q + 'Object expected');
    var e,
        s,
        n,
        i = ['precision', 1, G, 'rounding', 0, 8, 'toExpNeg', -1 / 0, 0, 'toExpPos', 0, 1 / 0];
    for (e = 0; e < i.length; e += 3)
        if ((n = t[(s = i[e])]) !== void 0)
            if (U(n) === n && n >= i[e + 1] && n <= i[e + 2]) this[s] = n;
            else throw Error(V + s + ': ' + n);
    if ((n = t[(s = 'LN10')]) !== void 0)
        if (n == Math.LN10) this[s] = new this(n);
        else throw Error(V + s + ': ' + n);
    return this;
}
var Y = se(le);
S = new Y(1);
const T = Y;
class ge {
    constructor({ essences: e, model: s }) {
        O(this, 'model');
        O(this, 'essences');
        O(this, 'greaterEssenceDropChance');
        (this.model = s), (this.essences = e), (this.greaterEssenceDropChance = new T('0.007'));
    }
    calculatePredictedProfit(e, s) {
        const n = new T(this.getTotalInvestment(e, s)),
            i = new T(s).dividedBy(3),
            { averageValueLesser: r, averageValueGreater: o } = this.getAverageEssenceValues(),
            c = new T('1').minus(this.greaterEssenceDropChance),
            a = o.times(this.greaterEssenceDropChance).plus(r.times(c));
        return i.times(a).minus(n).toDecimalPlaces(3).toString();
    }
    async calculateProfitRange(e, s) {
        const { averageValueLesser: n, averageValueGreater: i } = this.getAverageEssenceValues(),
            r = new T(this.getTotalInvestment(e, s)),
            o = this.calculatePredictedProfit(e, s);
        try {
            return await this.model.calculateProfitRange(this.essences, s, r, new T(o), this.greaterEssenceDropChance, i, n);
        } catch (c) {
            return console.error(c), !1;
        }
    }
    getBoughtEssence(e) {
        const s = this.essences.find(n => n.id === e);
        if (!s) throw (F.showError('Something went wrong. Please reload the page'), new Error('Essence not found in data somehow'));
        return s;
    }
    getTotalInvestment(e, s) {
        const n = this.getBoughtEssence(e);
        return n ? n.inputPrice * s : 0;
    }
    getAverageEssenceValues() {
        const e = this.essences.filter(r => !r.isGreater),
            s = this.essences.filter(r => r.isGreater),
            n = e.reduce((r, o) => r.plus(new T(o.inputPrice)), new T('0')).dividedBy(e.length),
            i = s.reduce((r, o) => r.plus(new T(o.inputPrice)), new T('0')).dividedBy(s.length);
        return { averageValueLesser: n, averageValueGreater: i };
    }
}
class pe {
    constructor() {
        O(this, 'worker');
        this.worker = new Worker(new URL('/assets/monteCarloWorker-DGyVEzIC.js', import.meta.url), { type: 'module' });
    }
    async calculateProfitRange(e, s, n, i, r, o, c) {
        const a = Math.floor(s / 3),
            l = 1e4,
            u = n.toNumber(),
            h = i.toNumber(),
            E = r.toNumber(),
            d = o.toNumber(),
            x = c.toNumber(),
            g = {
                essences: e,
                totalTrades: a,
                numSimulations: l,
                totalInvestment: u,
                expectedProfit: h,
                greaterEssenceDropChance: E,
                averageValueGreater: d,
                averageValueLesser: x,
            };
        return new Promise((w, _) => {
            (this.worker.onmessage = D => {
                const $ = D.data;
                w($);
            }),
                (this.worker.onerror = D => {
                    console.error(D), _(D);
                }),
                this.worker.postMessage(g);
        });
    }
}
class F {
    constructor() {
        O(this, 'data');
        O(this, 'calc');
        this.data = new fe('data.json');
        const e = new pe();
        this.calc = new ge({ essences: this.data.essences, model: e });
    }
    async init() {
        this.addListeners(), await this.data.fetchData();
    }
    addListeners() {
        var e;
        (e = document.querySelector('[data-submit]')) == null ||
            e.addEventListener('mouseup', async () => {
                F.showError(''), await this.calculate();
            });
    }
    async calculate() {
        const e = document.querySelector('[data-buy-type]'),
            s = document.querySelector('[data-amount]'),
            n = parseInt(s.value, 10);
        if (!e.value || isNaN(n)) return F.showError('U dun goofed');
        const i = await this.calc.calculatePredictedProfit(e.value, n),
            r = await this.calc.calculateProfitRange(e.value, n);
        if (!r) {
            F.showError('something went wrong');
            return;
        }
        const { minProfit: o, maxProfit: c, fluctuationPercentage: a } = r,
            l = this.calc.getTotalInvestment(e.value, n).toString(),
            u = this.calc.getBoughtEssence(e.value);
        this.showResult({
            invest: l,
            quantity: n,
            type: u.name,
            singlePrice: u.inputPrice.toString(),
            profit: i,
            fluctuationPercentage: a,
            minProfit: o,
            maxProfit: c,
        });
    }
    static showError(e) {
        document.querySelector('[data-errors]').innerHTML = e;
    }
    showResult({ invest: e, quantity: s, type: n, singlePrice: i, profit: r, fluctuationPercentage: o, minProfit: c, maxProfit: a }) {
        (document.querySelector('[data-invest]').innerHTML = e + ' Exalted Orbs'),
            (document.querySelector('[data-quantity]').innerHTML = s.toString()),
            (document.querySelector('[data-type]').innerHTML = n),
            (document.querySelector('[data-single-price]').innerHTML = i + ' Exalted Orbs'),
            (document.querySelector('[data-profit]').innerHTML = r + ' Exalted Orbs'),
            document.querySelector('[data-result-container]').classList.add('show'),
            (document.querySelector('[data-variance]').innerHTML = o + '%'),
            (document.querySelector('[data-variance-min]').innerHTML = c + ' Exalted Orbs'),
            (document.querySelector('[data-variance-max]').innerHTML = a + ' Exalted Orbs');
    }
}
const we = new F();
we.init();
