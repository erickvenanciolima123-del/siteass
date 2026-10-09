import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  db,
  auth,
  signInWithGoogle,
  logOut,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { Order, UserAccount, Review } from '../types';

/**
 * Saves or updates a user profile document in Firestore (`users/{userId}`)
 */
export async function saveUserProfile(user: UserAccount): Promise<void> {
  if (!user.uid) return;
  const path = `users/${user.uid}`;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        id: user.uid,
        email: user.email || '',
        displayName: user.name || 'Usuário',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Loads a user profile document from Firestore
 */
export async function getUserProfile(userId: string): Promise<Partial<UserAccount> | null> {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: data.id,
        name: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        isLoggedIn: true,
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Saves a completed order to Firestore (`orders/{orderId}`)
 */
export async function saveOrderToFirestore(order: Order, userId?: string): Promise<void> {
  const currentUid = userId || auth.currentUser?.uid;
  if (!currentUid) {
    console.warn('Order saved locally: user is not authenticated in Firebase yet');
    return;
  }

  const path = `orders/${order.id}`;
  try {
    const orderDoc = {
      id: order.id,
      userId: currentUid,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerDiscord: order.customerDiscord || '',
      paymentMethod: order.paymentMethod,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt || new Date().toLocaleDateString('pt-BR'),
      items: order.items,
      pixCode: order.pixCode || '',
    };

    await setDoc(doc(db, 'orders', order.id), orderDoc);
    console.log(`Order ${order.id} successfully persisted in Firestore!`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Listens to orders in real-time for the authenticated user (`orders` where userId == uid)
 */
export function subscribeToUserOrders(
  userId: string,
  onOrders: (orders: Order[]) => void
): () => void {
  const path = 'orders';
  const q = query(collection(db, path), where('userId', '==', userId));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((docItem) => {
        ordersList.push(docItem.data() as Order);
      });
      // Sort newest first
      ordersList.sort((a, b) => b.id.localeCompare(a.id));
      onOrders(ordersList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to real-time Firebase Authentication state changes
 */
export function subscribeToAuthState(
  onUserChanged: (user: UserAccount | null) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userAcc: UserAccount = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Gamer',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        isLoggedIn: true,
      };

      // Persist profile in Firestore
      saveUserProfile(userAcc).catch((err) =>
        console.warn('Could not auto-save user profile:', err)
      );

      onUserChanged(userAcc);
    } else {
      onUserChanged(null);
    }
  });
}

/**
 * Saves or updates a review in Firestore (`reviews/{reviewId}`)
 */
export async function saveReviewToFirestore(review: Review, userId?: string): Promise<void> {
  const currentUid = userId || auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error('Você precisa estar logado para enviar uma avaliação.');
  }

  const path = `reviews/${review.id}`;
  try {
    const reviewData = {
      id: review.id,
      userId: currentUid,
      productId: review.productId || '',
      productName: review.productName,
      authorName: review.authorName,
      authorInitial: review.authorInitial || review.authorName.charAt(0).toUpperCase() || 'U',
      authorPhoto: review.authorPhoto || '',
      rating: Number(review.rating),
      comment: review.comment,
      verifiedPurchase: Boolean(review.verifiedPurchase),
      date: review.date || new Date().toLocaleDateString('pt-BR'),
      createdAt: review.createdAt || new Date().toISOString(),
    };

    await setDoc(doc(db, 'reviews', review.id), reviewData, { merge: true });
    console.log(`Review ${review.id} successfully saved to Firestore!`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Deletes a review from Firestore
 */
export async function deleteReviewFromFirestore(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    console.log(`Review ${reviewId} successfully deleted.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Subscribes to all reviews in real-time from Firestore
 */
export function subscribeToAllReviews(
  onReviews: (reviews: Review[]) => void
): () => void {
  const path = 'reviews';
  const q = collection(db, path);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const list: Review[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: data.id || docSnap.id,
          userId: data.userId,
          productId: data.productId,
          productName: data.productName,
          authorName: data.authorName,
          authorInitial: data.authorInitial || data.authorName?.charAt(0) || 'U',
          authorPhoto: data.authorPhoto,
          rating: Number(data.rating),
          comment: data.comment,
          verifiedPurchase: Boolean(data.verifiedPurchase),
          date: data.date,
          createdAt: data.createdAt,
        });
      });
      // Sort newest first
      list.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.id.localeCompare(a.id);
      });
      onReviews(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export { signInWithGoogle, logOut };
