import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Flower, Seal } from "@/components/Ornaments";
import { checkAdmin, useAuth } from "@/lib/auth";
import { errorMessage, supabase, supabaseReady } from "@/lib/supabase";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-widget border border-blush-2 bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-fast focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const translate = (msg: string) =>
  /invalid login credentials/i.test(msg)
    ? "Email atau password salah."
    : /email not confirmed/i.test(msg)
      ? "Email belum dikonfirmasi."
      : /rate limit|too many/i.test(msg)
        ? "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
        : msg;

type Mode = "login" | "forgot" | "reset";

const LoginPage = () => {
  const { session, isAdmin, loading, recovering, clearRecovering, signOut } = useAuth();
  const { profile } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Login · Admin";
  }, []);
  useEffect(() => {
    if (recovering) setMode("reset");
  }, [recovering]);

  if (!loading && session && isAdmin && mode !== "reset") return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (!(await checkAdmin(data.user.id))) {
          await signOut();
          throw new Error("Akun ini tidak punya akses ke dashboard.");
        }
        navigate(from, { replace: true });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setInfo("Kalau email terdaftar, link reset password sudah dikirim. Cek inbox/spam.");
      } else {
        if (password.length < 8) throw new Error("Password minimal 8 karakter.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        clearRecovering();
        toast.success("Password berhasil diganti");
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      setError(translate(errorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, [string, string]> = {
    login: ["Welcome back", "Masuk untuk mengelola toko dan isi website."],
    forgot: ["Lupa password", "Masukkan email akunmu, kami kirim link untuk membuat password baru."],
    reset: ["Password baru", "Buat password baru untuk akunmu."],
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--blush))_0%,transparent_70%)]" />
      <Flower className="pointer-events-none absolute left-[10%] top-[18%] h-12 w-12" color="#fff" />
      <Flower className="pointer-events-none absolute bottom-[14%] right-[12%] h-10 w-10" color="hsl(var(--rose) / .6)" />
      <Flower className="pointer-events-none absolute bottom-[26%] left-[16%] h-6 w-6" color="hsl(var(--rose) / .45)" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke website
        </Link>

        <div className="window relative p-7 sm:p-9">
          <Seal className="absolute -right-5 -top-6 w-20 rotate-12" letter={profile.firstName.charAt(0)} />
          <p className="font-script text-4xl leading-none text-primary">{profile.firstName}</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">{titles[mode][0]}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{titles[mode][1]}</p>

          {!supabaseReady && (
            <p className="mt-5 rounded-widget bg-blush px-4 py-3 text-sm text-accent-foreground">
              Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
            </p>
          )}

          <form onSubmit={submit} className="mt-7 grid gap-4">
            {mode !== "reset" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-foreground">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label className="grid gap-1.5">
                <span className="flex items-center justify-between text-sm font-semibold text-foreground">
                  {mode === "reset" ? "Password baru" : "Password"}
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs font-semibold text-primary hover:underline">
                      Lupa password?
                    </button>
                  )}
                </span>
                <span className="relative">
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={mode === "reset" ? 8 : undefined}
                    autoComplete={mode === "reset" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(field, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-blush"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
            )}

            {error && (
              <p role="alert" className="rounded-widget bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            {info && <p className="rounded-widget bg-blush px-4 py-3 text-sm text-accent-foreground">{info}</p>}

            <button type="submit" disabled={busy || !supabaseReady} className={cn("btn-primary mt-1 w-full !py-3.5", (busy || !supabaseReady) && "pointer-events-none opacity-70")}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Masuk" : mode === "forgot" ? "Kirim link reset" : "Simpan password"}
            </button>

            {mode === "forgot" && (
              <button type="button" onClick={() => setMode("login")} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                Kembali ke login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
