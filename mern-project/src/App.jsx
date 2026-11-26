import { useCallback, useEffect, useMemo, useState } from "react";
import { addToCart, clearCart, getCart, getProducts, removeFromCart, updateCartQuantity } from "./api";
import heroImage from "./assets/hero.png";

const Icon = ({ name, size = 20 }) => {
  const paths = { bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>, search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>, plus: <><path d="M12 5v14M5 12h14"/></>, minus: <path d="M5 12h14"/>, close: <><path d="m18 6-12 12M6 6l12 12"/></>, trash: <><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></>, arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></> };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const demoProducts = [
  { _id: "demo-sneakers", name: "Classic Sneakers", description: "Comfortable everyday sneakers", price: 1499, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-watch", name: "Wrist Watch", description: "A timeless detail for every day", price: 2199, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-backpack", name: "Everyday Backpack", description: "Room for work, weekends, and more", price: 999, category: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-headphones", name: "Studio Headphones", description: "Your own little world of sound", price: 1799, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-mug", name: "Ceramic Coffee Mug", description: "A slower start to the morning", price: 349, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558f34514?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-sunglasses", name: "Sunday Sunglasses", description: "Classic frames for bright days", price: 799, category: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-lamp", name: "Soft Glow Table Lamp", description: "Warm light for slow evenings", price: 1899, category: "Home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-chair", name: "Everyday Lounge Chair", description: "A comfortable corner of your own", price: 5499, category: "Home", image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-camera", name: "Pocket Film Camera", description: "Keep the moments worth keeping", price: 3299, category: "Electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-speaker", name: "Portable Speaker", description: "Good sound, wherever you go", price: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-tote", name: "Market Day Tote", description: "An easy carryall for every plan", price: 599, category: "Bags", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-wallet", name: "Leather Card Holder", description: "A neat home for the essentials", price: 899, category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-bottle", name: "Insulated Bottle", description: "A little refreshment on the move", price: 699, category: "Everyday", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-notebook", name: "Linen Cover Notebook", description: "Space for the next good idea", price: 449, category: "Everyday", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-vase", name: "Sculpted Ceramic Vase", description: "A quiet centrepiece for any room", price: 1199, category: "Home", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700&auto=format&fit=crop&q=85" },
  { _id: "demo-sneakers2", name: "Canvas Weekend Shoes", description: "Lightweight comfort for laid-back days", price: 1299, category: "Footwear", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=700&auto=format&fit=crop&q=85" },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const refreshCart = useCallback(async () => { const data = await getCart(); setCart(data.items || []); }, []);
  useEffect(() => {
    Promise.all([getProducts(), getCart()]).then(([items, data]) => { setProducts(items); setCart(data.items || []); }).catch(() => {
      setDemoMode(true);
      setProducts(demoProducts);
      try { setCart(JSON.parse(localStorage.getItem("goodthings-demo-cart") || "[]")); } catch { setCart([]); }
    }).finally(() => setLoading(false));
  }, []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 2500); return () => clearTimeout(timer); }, [notice]);

  const categories = useMemo(() => ["All", ...new Set(products.map((item) => item.category).filter(Boolean))], [products]);
  const visibleProducts = products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const mutateCart = async (action, message) => {
    setBusy(true); setError("");
    try {
      await action();
      await refreshCart();
      setNotice(message);
    }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const saveDemoCart = (nextCart) => { setCart(nextCart); localStorage.setItem("goodthings-demo-cart", JSON.stringify(nextCart)); };
  const demoAdd = (product) => { const existing = cart.find((item) => item.product._id === product._id); saveDemoCart(existing ? cart.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { product, quantity: 1 }]); setNotice("Added to your bag ✳"); };
  const demoRemove = (productId) => { saveDemoCart(cart.filter((item) => item.product._id !== productId)); setNotice("Removed from your bag"); };
  const demoClear = () => { saveDemoCart([]); setNotice("Your bag is clear"); };
  const changeQuantity = (item, amount) => demoMode
    ? (item.quantity + amount < 1 ? demoRemove(item.product._id) : (saveDemoCart(cart.map((entry) => entry.product._id === item.product._id ? { ...entry, quantity: entry.quantity + amount } : entry)), setNotice("Cart updated")))
    : mutateCart(() => item.quantity + amount < 1 ? removeFromCart(item.product._id) : updateCartQuantity(item.product._id, item.quantity + amount), "Cart updated");

  if (loading) return <main className="loading-screen"><span className="loader"/><p>Setting up your good finds…</p></main>;

  return <div className="store">
    <div className="announcement">A little something for your everyday <span>✳</span> Free delivery on orders over ₹2,000</div>
    <header className="nav-wrap"><a className="brand" href="#top"><span className="brand-name">good<span>things</span><i>®</i></span><small>OBJECTS FOR EVERYDAY LIVING</small></a><nav aria-label="Main navigation"><a className="nav-active" href="#shop"><span>01</span> Shop</a><a href="#story"><span>02</span> Our story</a><a href="#footer"><span>03</span> Say hello</a></nav><div className="nav-actions"><label className="nav-search"><Icon name="search" size={18}/><input aria-label="Search products" placeholder="Find something…" value={query} onChange={(e) => { setQuery(e.target.value); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}/></label><button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}><span>YOUR BAG</span><b>{count}</b><Icon name="bag" size={18}/></button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-rule"/> THE EVERYDAY EDIT <span className="edition">NO. 04 — 2026</span></p><h1>Good things<br/>for <em>every day.</em></h1><p className="hero-sub">Considered essentials for living a little more beautifully. Useful by nature, lovely by design.</p><div className="hero-actions"><a className="dark-button" href="#shop">Explore the collection <Icon name="arrow" size={17}/></a><a className="text-link" href="#story">A little about us <span>↗</span></a></div><div className="hero-note"><span>✳</span> Small joys. Better days.</div></div><aside className="hero-type-note"><span className="hero-asterisk">✳</span><span className="note-rule"/><p>OBJECTS<br/>WITH A<br/><em>POINT OF VIEW.</em></p><small>THOUGHTFULLY PICKED<br/>FOR EVERYDAY LIVING</small><span className="note-index">GT—001</span></aside><div className="hero-footerline"><span>DESIGNED FOR THE EVERYDAY</span><span>GOOD DESIGN / BETTER DAYS</span><span>EST. WITH CARE · 2026</span></div></section>
      <section className="ticker" aria-label="Shop qualities"><span>GOOD DESIGN</span><b>✳</b><span>BETTER EVERYDAY</span><b>✳</b><span>THOUGHTFULLY PICKED</span><b>✳</b><span>MADE TO BE KEPT</span></section>
      <section className="shop-section" id="shop"><div className="section-heading"><div><p className="eyebrow">A FEW GOOD THINGS</p><h2>Meet your new <em>favourites.</em></h2></div><p>Useful, lovely, and made to fit right into your life.</p></div><div className="shop-toolbar"><div className="filters" aria-label="Filter by category">{categories.map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div><span>{visibleProducts.length} lovely things</span></div>
      {error && <div className="error-banner" role="alert">{error} <button onClick={() => setError("")}>Dismiss</button></div>}
      {demoMode && <p className="demo-note">You’re browsing the sample collection. Your bag is saved on this device.</p>}
      {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product._id}><div className={`product-image tone-${index % 4}`}><img src={product.image || heroImage} alt={product.name} loading="lazy"/><span className="product-category">{product.category || "Everyday"}</span><button className="quick-add" onClick={() => demoMode ? demoAdd(product) : mutateCart(() => addToCart(product._id), "Added to your bag ✳")} disabled={busy} aria-label={`Add ${product.name} to bag`}><Icon name="plus"/></button></div><div className="product-meta"><div><h3>{product.name}</h3><p>{product.description || "A little something for every day."}</p></div><strong>{money(product.price)}</strong></div></article>)}</div> : <div className="no-products"><span>✳</span><h3>Nothing here just yet.</h3><p>Try another search or category.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Show everything</button></div>}
      </section>
      <section className="story" id="story"><div className="story-mark">g<span>.</span>t</div><div><p className="eyebrow">A NOTE FROM US</p><h2>More meaning.<br/><em>Less, but better.</em></h2></div><p>We believe the things we keep close should feel good to use and good to own. So we look for thoughtful design, everyday usefulness, and those little details that make a regular Tuesday feel special.</p><a href="#shop">A good place to start <Icon name="arrow" size={17}/></a></section>
      <section className="newsletter"><span>✳</span><div><p className="eyebrow">OCCASIONAL GOOD NEWS</p><h2>A little joy in your inbox.</h2></div><a href="mailto:hello@goodthings.example?subject=Keep%20me%20posted">Say hello <Icon name="arrow" size={17}/></a></section>
    </main>
    <footer id="footer"><a className="brand footer-brand" href="#top">good<span>things</span><i>®</i></a><p>Everyday things, chosen with care.</p><span>© 2026 goodthings studio</span></footer>
    {notice && <div className="toast" role="status">✳ &nbsp;{notice}</div>}
    {cartOpen && <div className="drawer-scrim" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping bag"><div className="drawer-head"><div><p className="eyebrow">YOUR GOOD FINDS</p><h2>Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><Icon name="close"/></button></div>
      {!cart.length ? <div className="empty-bag"><div>✳</div><h3>Your bag is taking a breather.</h3><p>There are plenty of good things waiting.</p><button className="dark-button" onClick={() => setCartOpen(false)}>Explore the shop <Icon name="arrow" size={17}/></button></div> : <><div className="cart-items">{cart.filter((item) => item.product).map((item) => <article className="cart-line" key={item.product._id}><img src={item.product.image || heroImage} alt=""/><div className="line-info"><h3>{item.product.name}</h3><p>{money(item.product.price)}</p><div className="quantity-control"><button disabled={busy} onClick={() => changeQuantity(item, -1)} aria-label="Decrease quantity"><Icon name="minus" size={15}/></button><span>{item.quantity}</span><button disabled={busy} onClick={() => changeQuantity(item, 1)} aria-label="Increase quantity"><Icon name="plus" size={15}/></button></div></div><div className="line-end"><strong>{money(item.product.price * item.quantity)}</strong><button className="remove-item" disabled={busy} onClick={() => demoMode ? demoRemove(item.product._id) : mutateCart(() => removeFromCart(item.product._id), "Removed from your bag")} aria-label={`Remove ${item.product.name}`}><Icon name="trash" size={16}/></button></div></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>Delivery and taxes calculated at checkout.</p><button className="checkout-button" onClick={() => setNotice("Checkout is ready to connect to a payment provider.")}>Continue to checkout <Icon name="arrow" size={17}/></button><button className="clear-cart" disabled={busy} onClick={() => demoMode ? demoClear() : mutateCart(clearCart, "Your bag is clear")}>Clear bag</button></div></>}
    </aside></div>}
  </div>;
}
