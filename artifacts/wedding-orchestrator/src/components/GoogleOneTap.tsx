import { useEffect } from 'react';
import { signInWithIdToken } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleOneTap() {
  const { toast } = useToast();
  const user = useStore(state => state.user);
  const syncStatus = useStore(state => state.syncStatus);

  useEffect(() => {
    // Only show if user is not logged in
    if (user || syncStatus === 'syncing') return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID missing for One Tap');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        // Generate a simple nonce
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce: nonce, // Pass nonce to Google
          callback: async (response: any) => {
            try {
              await signInWithIdToken(response.credential, nonce); // Pass SAME nonce to Supabase
              toast({
                title: "Welcome back!",
                description: "You've successfully signed in with Google.",
              });
            } catch (error: any) {
              console.error('One Tap Login Error:', error);
              toast({
                title: "Login failed",
                description: error.message || "Could not sign in with Google.",
                variant: "destructive"
              });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap not displayed:', notification.getNotDisplayedReason());
          }
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, syncStatus, toast]);

  return null; // Invisible component
}
