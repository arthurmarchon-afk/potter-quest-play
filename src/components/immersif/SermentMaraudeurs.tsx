import { useEffect, useRef, useState } from "react";

import { useDecouvertes } from "@/lib/decouvertes-context";
import { IconeCarte, IconePlume, Ornement } from "@/components/immersif/Icones";
import { ParcheminOuvert } from "@/components/immersif/Curiosite";

/* Le serment des Maraudeurs.
   Reconnaissance vocale quand le navigateur la propose, plume et encre sinon. */

const PHRASE = "je jure solennellement que mes intentions sont mauvaises";

function normaliser(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function correspond(t: string) {
  const n = normaliser(t);
  if (n.includes(normaliser(PHRASE))) return true;
  // Tolérance : la reconnaissance vocale écorche souvent un mot ou deux.
  const mots = normaliser(PHRASE).split(" ");
  const trouves = mots.filter((m) => n.includes(m)).length;
  return trouves >= mots.length - 2;
}

type Reco = { start: () => void; stop: () => void; abort: () => void };

export function SermentMaraudeurs() {
  const { secretTrouve, revelerSecret } = useDecouvertes();
  const [ecoute, setEcoute] = useState(false);
  const [saisie, setSaisie] = useState("");
  const [entendu, setEntendu] = useState("");
  const [rate, setRate] = useState(false);
  const [revelation, setRevelation] = useState(false);
  const [vocalDispo, setVocalDispo] = useState(false);
  const recoRef = useRef<Reco | null>(null);

  const actif = secretTrouve("maraudeurs");

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setVocalDispo(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recoRef.current?.abort();
  }, []);

  function reussir() {
    recoRef.current?.abort();
    setEcoute(false);
    setRate(false);
    if (!actif) revelerSecret("maraudeurs");
    setRevelation(true);
  }

  function ecouter() {
    const w = window as unknown as {
      SpeechRecognition?: new () => Reco;
      webkitSpeechRecognition?: new () => Reco;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const reco = new Ctor() as Reco & {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
      onend: () => void;
    };
    reco.lang = "fr-FR";
    reco.interimResults = true;
    reco.continuous = false;
    reco.onresult = (e) => {
      let texte = "";
      for (let i = 0; i < e.results.length; i++) texte += ` ${e.results[i]![0]!.transcript}`;
      setEntendu(texte.trim());
      if (correspond(texte)) reussir();
    };
    reco.onerror = () => setEcoute(false);
    reco.onend = () => {
      setEcoute(false);
      setEntendu((t) => {
        if (t && !correspond(t)) setRate(true);
        return t;
      });
    };
    recoRef.current = reco;
    setEntendu("");
    setRate(false);
    setEcoute(true);
    reco.start();
  }

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <div className="flex items-center justify-center gap-4 text-or/45" aria-hidden>
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-or/45" />
        <Ornement className="h-2.5 w-2.5" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-or/45" />
      </div>

      <p className="annotation mt-6 text-lg">
        {actif
          ? "« L'encre reconnaît votre voix. La carte s'ouvre à nouveau. »"
          : "« Ce parchemin est vierge. Il paraît qu'il faut lui parler avec les mots exacts. »"}
      </p>

      <p className="mt-5 font-manuscrit text-base italic text-parchemin/45">
        Une phrase, dit-on, ouvre certaines choses à Poudlard. Elle commence par « Je jure
        solennellement… »
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {vocalDispo ? (
          <button
            type="button"
            onClick={ecouter}
            disabled={ecoute}
            className="bouton-magique px-6 py-3 text-[0.6rem] disabled:opacity-60"
          >
            {ecoute ? "Le parchemin écoute…" : "Prononcer la phrase"}
          </button>
        ) : null}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (correspond(saisie)) reussir();
            else setRate(true);
          }}
        >
          <span className="text-or/50 [&>svg]:h-4 [&>svg]:w-4" aria-hidden>
            <IconePlume />
          </span>
          <input
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            aria-label="Écrire la phrase sur le parchemin"
            placeholder="…ou l'écrire à la plume"
            className="min-w-[220px] rounded-[2px] border border-or/25 bg-black/40 px-4 py-2.5 font-manuscrit text-base italic text-parchemin/85 outline-none placeholder:text-parchemin/30 focus:border-or/60"
          />
          <button
            type="submit"
            className="rounded-[2px] border border-or/25 px-4 py-2.5 font-display text-[0.55rem] uppercase tracking-[0.3em] text-parchemin/70 transition-colors hover:border-or/60 hover:text-or"
          >
            Tracer
          </button>
        </form>
      </div>

      {ecoute && entendu ? (
        <p className="mt-4 font-manuscrit text-sm italic text-parchemin/40">« {entendu} »</p>
      ) : null}
      {rate ? (
        <p className="mt-4 font-manuscrit text-sm italic text-[color-mix(in_oklab,var(--gryffondor)_70%,var(--parchemin))]">
          « M. Lunard présente ses respects et invite l'intéressé à réessayer. »
        </p>
      ) : null}

      {actif ? (
        <div className="mt-10 border-t border-or/15 pt-8">
          <span className="sceau mx-auto h-12 w-12 [&>svg]:h-5 [&>svg]:w-5">
            <IconeCarte />
          </span>
          <p className="mt-5 font-display text-[0.6rem] uppercase tracking-[0.4em] text-or">
            Carte du Maraudeur · active
          </p>
          <p className="annotation mx-auto mt-4 max-w-md text-base">
            Des pas traversent le couloir du cinquième étage. Derrière la statue de la sorcière
            borgne, un escalier descend vers Pré-au-Lard.
          </p>
        </div>
      ) : null}

      {revelation ? (
        <ParcheminOuvert
          titre="Je jure solennellement…"
          sur="Le parchemin s'anime"
          onFermer={() => setRevelation(false)}
        >
          Des lignes d'encre courent sur le vélin et dessinent les couloirs du château. En bas à
          droite, quatre signatures : Lunard, Queudver, Patmol et Cornedrue. Vous venez de trouver
          quelque chose que la plupart des visiteurs ne verront jamais.
        </ParcheminOuvert>
      ) : null}
    </div>
  );
}
