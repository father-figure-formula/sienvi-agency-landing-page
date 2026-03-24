import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Newspaper, Loader2, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const NewsletterModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "subscribe-newsletter",
        {
          body: { email },
        }
      );

      if (error) throw error;

      if (data?.alreadySubscribed) {
        toast.info("You're already subscribed! Check your inbox.");
        setOpen(false);
        setEmail("");
        return;
      }

      setSuccess(true);
      toast.success("Welcome to the Sienvi community! Check your inbox.");

      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setEmail("");
      }, 2500);
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSuccess(false); setEmail(""); } }}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm gap-2"
            id="newsletter-signup-btn"
          >
            <Newspaper className="h-4 w-4" />
            Join Our Newsletter
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-gray-900 via-gray-900 to-plc-purple/30 text-white shadow-2xl shadow-plc-purple/20">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-plc-purple/10 via-transparent to-plc-purple/5 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-8 gap-4 relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle2 className="h-16 w-16 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold">You're In!</h3>
              <p className="text-gray-400 text-center text-sm">
                Check your inbox for your welcome gift — the 20-Hour Reclaim Audit.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-plc-purple/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-plc-purple" />
                  </div>
                </div>
                <DialogTitle className="text-center text-xl font-bold text-white">
                  Join the Sienvi Newsletter
                </DialogTitle>
                <DialogDescription className="text-center text-gray-400 text-sm leading-relaxed">
                  Get automation secrets, Amazon strategies, and the operator's mindset — delivered to your inbox. Plus, get our free <span className="text-plc-purple font-medium">20-Hour Reclaim Audit</span> instantly.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubscribe} className="mt-6 space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-plc-purple focus:ring-plc-purple/20 h-12 pl-4 pr-4"
                    disabled={loading}
                    required
                    id="newsletter-email-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-plc-purple hover:bg-plc-purple/90 text-white h-12 font-semibold transition-all duration-200"
                  id="newsletter-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe & Get Your Free Audit"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
