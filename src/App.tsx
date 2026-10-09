import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Filter, Search, Sparkles, AlertCircle, Star, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product, CartItem, Order, UserAccount, Review, CategoryId } from './types';
import { PRODUCTS, CATEGORIES, REVIEWS } from './data/products';
import { Header } from './components/Header';
import { Storefront } from './components/Storefront';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserAccountModal } from './components/UserAccountModal';
import { SocialModal } from './components/SocialModal';
import { Footer } from './components/Footer';
import { TermsModal } from './components/TermsModal';
import { CategoryViewPage } from './components/CategoryViewPage';
import {
  subscribeToAuthState,
  subscribeToUserOrders,
  saveOrderToFirestore,
  saveReviewToFirestore,
  deleteReviewFromFirestore,
  subscribeToAllReviews,
} from './services/firestoreService';
import { auth } from './lib/firebase';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'HOME' | 'CATEGORY_PAGE'>('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('ALL');

  const handleOpenCategoryPage = (cat: CategoryId) => {
    setSearchQuery('');
    setSelectedCategory(cat);
    setCurrentView('CATEGORY_PAGE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('HOME');
    setSearchQuery('');
    setSelectedCategory('ALL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart & Orders State (persisted locally)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('abravanel_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.flatMap((it) => {
        const product = PRODUCTS.find(p => p.id === it?.product?.id);
        return product && !product.isSoldOut && Number.isFinite(it.quantity) && it.quantity > 0
          ? [{ product, quantity: Math.min(Math.floor(it.quantity), product.stockCount) }] : [];
      }) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('abravanel_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User State
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('abravanel_user');
      return saved
        ? JSON.parse(saved)
        : { name: 'Visitante', email: '', isLoggedIn: false };
    } catch {
      return { name: 'Visitante', email: '', isLoggedIn: false };
    }
  });

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'ACCOUNT' | 'ORDERS'>('ACCOUNT');
  const [isSocialsOpen, setIsSocialsOpen] = useState(false);
  const [termsTitle, setTermsTitle] = useState<string | null>(null);

  // Reviews State: Initial seed reviews merged with real-time Firestore database reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('abravanel_reviews');
      return saved ? JSON.parse(saved) : REVIEWS;
    } catch {
      return REVIEWS;
    }
  });

  const [reviewModalProduct, setReviewModalProduct] = useState<{
    id: string;
    name: string;
    category?: string;
    accentColor?: string;
  } | null>(null);
  const [existingReviewToEdit, setExistingReviewToEdit] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Quick toast feedback when adding to cart
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abravanel_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Sync orders to localStorage & backend
  useEffect(() => {
    try {
      localStorage.setItem('abravanel_orders', JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abravanel_user', JSON.stringify(user));
    } catch {
      // Ignore
    }
  }, [user]);

  // Real-time Firebase Authentication listener
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((fbUser) => {
      if (fbUser) {
        setUser(fbUser);
      }
    });
    return () => unsubAuth();
  }, []);

  // Real-time Firestore user orders listener
  useEffect(() => {
    const activeUid = user.uid || auth.currentUser?.uid;
    if (user.isLoggedIn && activeUid) {
      const unsubOrders = subscribeToUserOrders(activeUid, (serverOrders) => {
        if (serverOrders) {
          setOrders(serverOrders);
        }
      });
      return () => unsubOrders();
    }
  }, [user.isLoggedIn, user.uid]);

  // Real-time Firestore reviews listener
  useEffect(() => {
    const unsubReviews = subscribeToAllReviews((firestoreReviews) => {
      if (firestoreReviews && firestoreReviews.length > 0) {
        setReviews((prev) => {
          const map = new Map<string, Review>();
          // Base seeds
          REVIEWS.forEach((r) => map.set(r.id, r));
          // Existing reviews in local state
          prev.forEach((r) => map.set(r.id, r));
          // Real-time reviews from Firestore database
          firestoreReviews.forEach((r) => map.set(r.id, r));

          const merged = Array.from(map.values());
          merged.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return b.id.localeCompare(a.id);
          });
          return merged;
        });
      }
    });
    return () => unsubReviews();
  }, []);

  // Sync reviews to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem('abravanel_reviews', JSON.stringify(reviews));
    } catch {
      // Ignore
    }
  }, [reviews]);

  // Check if current user has purchased a product
  const hasUserPurchasedProduct = (productId: string, productName?: string): boolean => {
    if (!user.isLoggedIn) return false;
    return orders.some(
      (order) =>
        !order.isDemo && order.status === 'PAID' &&
        order.items?.some(
          (item) =>
            item.productId === productId ||
            (productName && item.productName?.toLowerCase() === productName.toLowerCase())
        )
    );
  };

  // Open review modal for a product
  const handleOpenReviewModal = (
    product: { id: string; name: string; category?: string; accentColor?: string },
    existing?: Review | null
  ) => {
    const targetExisting =
      existing !== undefined
        ? existing
        : reviews.find(
            (r) =>
              (r.productId === product.id ||
                r.productName?.toLowerCase() === product.name.toLowerCase()) &&
              r.userId === user.uid
          );
    setReviewModalProduct(product);
    setExistingReviewToEdit(targetExisting || null);
    setIsReviewModalOpen(true);
  };

  // Submit new or updated review to Firestore
  const handleSubmitReview = async (data: {
    productId: string;
    productName: string;
    rating: number;
    comment: string;
    reviewId?: string;
  }) => {
    const activeUid = user.uid || auth.currentUser?.uid;
    if (!activeUid) {
      throw new Error('Você precisa estar logado com sua conta Google para publicar uma avaliação.');
    }

    const reviewId = data.reviewId || `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReview: Review = {
      id: reviewId,
      userId: activeUid,
      productId: data.productId,
      productName: data.productName,
      authorName: user.name || 'Cliente Verificado',
      authorInitial: (user.name || 'C').charAt(0).toUpperCase(),
      authorPhoto: user.photoURL,
      rating: data.rating,
      comment: data.comment,
      verifiedPurchase: true,
      date: new Date().toLocaleDateString('pt-BR'),
      createdAt: new Date().toISOString(),
    };

    // Save directly to Firestore database
    await saveReviewToFirestore(newReview, activeUid);

    // Update state immediately
    setReviews((prev) => {
      const idx = prev.findIndex((r) => r.id === newReview.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newReview;
        return next;
      }
      return [newReview, ...prev];
    });

    setToastNotification('Sua avaliação foi publicada com sucesso!');
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Delete user review from Firestore
  const handleDeleteReview = async (reviewId: string) => {
    await deleteReviewFromFirestore(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setToastNotification('Avaliação removida com sucesso.');
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Add to Cart Handler
  const handleAddToCart = (product: Product) => {
    if (product.isSoldOut) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stockCount) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  // Direct checkout from product modal
  const handleDirectCheckout = (product: Product) => {
    if (product.isSoldOut) return;
    handleAddToCart(product);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Cart operations
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(newQty, item.product.stockCount) } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Complete Order
  const handleOrderCompleted = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    if (newOrder.isDemo) return;

    // Persist real order to Firestore database
    const targetUid = user.uid || auth.currentUser?.uid;
    if (targetUid) {
      try {
        await saveOrderToFirestore(newOrder, targetUid);
      } catch (err) {
        console.warn('Could not persist order to Firestore:', err);
      }
    }

    // Optionally sync with backend API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => {
      // Offline safe fallback
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    } else if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    return list;
  }, [searchQuery, selectedCategory]);

  // Total cart items count
  const cartCount = cart.reduce((total, it) => total + it.quantity, 0);

  // Groupings for 'ALL' view without search query
  const keysProducts = useMemo(() => PRODUCTS.filter((p) => p.category === 'KEYS'), []);
  const assinaturasProducts = useMemo(() => PRODUCTS.filter((p) => p.category === 'ASSINATURAS'), []);
  const destaquesProducts = useMemo(() => PRODUCTS.filter((p) => p.category === 'DESTAQUES'), []);
  const acaoProducts = useMemo(() => PRODUCTS.filter((p) => p.category === 'ACAO_AVENTURA'), []);
  const viraisProducts = useMemo(() => PRODUCTS.filter((p) => p.category === 'VIRAIS'), []);

  return (
    <div className="min-h-screen app-root text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification when adding item */}
      {addedItemName && (
        <div role="status" aria-live="polite" className="cart-toast fixed bottom-6 right-6 z-50 bg-[#0e1420] border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-xs">
            <p className="font-bold text-emerald-400">Adicionado ao Carrinho!</p>
            <p className="text-slate-300 font-medium truncate max-w-[200px]">{addedItemName}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAddedItemName(null);
              setIsCartOpen(true);
            }}
            className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] hover:bg-emerald-400 transition-colors"
          >
            Ver Carrinho
          </button>
        </div>
      )}

      {/* Toast Notification when review is saved */}
      {toastNotification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0e1420] border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-400">Avaliação</p>
            <p className="text-slate-300 font-medium">{toastNotification}</p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeCategory={currentView === 'CATEGORY_PAGE' ? selectedCategory : undefined}
        onNavigateCategory={handleOpenCategoryPage}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentView === 'CATEGORY_PAGE') {
            setCurrentView('HOME');
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSocials={() => setIsSocialsOpen(true)}
        onOpenAccount={() => {
          setAccountTab('ACCOUNT');
          setIsAccountOpen(true);
        }}
        onOpenOrders={() => {
          setAccountTab('ORDERS');
          setIsAccountOpen(true);
        }}
        user={user}
        onNavigateHome={handleBackToHome}
        products={PRODUCTS}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onAddToCart={handleAddToCart}
      />

      {currentView === 'CATEGORY_PAGE' ? (
        <CategoryViewPage initialCategory={selectedCategory} products={PRODUCTS} onOpenDetails={setSelectedProduct} onAddToCart={handleAddToCart} cartProductIds={cart.map(it => it.product.id)} onBackToHome={handleBackToHome}/>
      ) : (
        <Storefront searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} onNavigateCategory={handleOpenCategoryPage} onOpenDiscord={() => setIsSocialsOpen(true)} onOpenDetails={setSelectedProduct} onAddToCart={handleAddToCart} cartProductIds={cart.map(it => it.product.id)}/>
      )}

      {/* Footer */}
      <Footer
        onNavigateCategory={(cat) => handleOpenCategoryPage(cat as CategoryId)}
        onOpenAccount={() => {
          setAccountTab('ACCOUNT');
          setIsAccountOpen(true);
        }}
        onOpenOrders={() => {
          setAccountTab('ORDERS');
          setIsAccountOpen(true);
        }}
        onOpenTerms={(title) => setTermsTitle(title)}
        onOpenDiscord={() => setIsSocialsOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
        isAddedToCart={selectedProduct ? cart.some((it) => it.product.id === selectedProduct.id) : false}
        user={user}
        reviews={reviews}
        hasPurchased={selectedProduct ? hasUserPurchasedProduct(selectedProduct.id, selectedProduct.name) : false}
        onOpenReviewModal={(prod, existing) => handleOpenReviewModal(prod, existing)}
        onOpenAccountModal={() => {
          setAccountTab('ACCOUNT');
          setIsAccountOpen(true);
        }}
      />

      {/* Review Modal for Verified Buyers */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={reviewModalProduct}
        user={user}
        existingReview={existingReviewToEdit}
        onSubmitReview={handleSubmitReview}
        onDeleteReview={handleDeleteReview}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        user={user}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* User Account & Orders Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountTab}
        user={user}
        onUpdateUser={setUser}
        orders={orders}
        reviews={reviews}
        onOpenReviewModal={(prod) => {
          const matchedProd = PRODUCTS.find((p) => p.id === prod.id || p.name === prod.name);
          handleOpenReviewModal(matchedProd || { id: prod.id, name: prod.name });
        }}
      />

      {/* Social Networks Modal */}
      <SocialModal
        isOpen={isSocialsOpen}
        onClose={() => setIsSocialsOpen(false)}
      />

      {/* Terms and Policies Modal */}
      <TermsModal
        isOpen={termsTitle !== null}
        onClose={() => setTermsTitle(null)}
        title={termsTitle || 'Termos e Serviços'}
      />
    </div>
  );
}
