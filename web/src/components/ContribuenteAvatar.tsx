import { AvatarThemes, AvatarSizes, Fonts } from '../theme';

type AvatarSizeKey = keyof typeof AvatarSizes;

interface ContribuenteAvatarProps {
  /** Cognome for persona fisica, or denominazione for persona giuridica */
  cognomeDenominazione: string;
  /** Nome (first name) - empty string for persona giuridica */
  nome: string;
  /** Avatar size - use AvatarSizes keys (xs, sm, md, default, lg, xl) or a number */
  size?: AvatarSizeKey | number;
  /** Optional ID or unique identifier for deterministic theme selection */
  id?: string;
}

/**
 * Generates a deterministic hash code from a string.
 * Used to consistently assign the same avatar theme to the same contribuente.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Extracts initials from a contribuente name.
 *
 * For persona fisica (nome is not empty):
 *   - Returns first letter of cognome + first letter of nome
 *   - Example: "Rossi", "Mario" → "RM"
 *
 * For persona giuridica (nome is empty):
 *   - If multiple words: first letter of first two words
 *   - If single word: first two letters
 *   - Example: "Studio Legale Bianchi" → "SL"
 *   - Example: "Telecom" → "TE"
 */
function getInitials(cognomeDenominazione: string, nome: string): [string, string] {
  const cleanCognome = cognomeDenominazione.trim();
  const cleanNome = nome.trim();

  // Persona fisica: has both cognome and nome
  if (cleanNome) {
    const initial1 = cleanCognome.charAt(0).toUpperCase() || '?';
    const initial2 = cleanNome.charAt(0).toUpperCase() || '?';
    return [initial1, initial2];
  }

  // Persona giuridica: only denominazione
  const words = cleanCognome.split(/\s+/).filter(w => w.length > 0);

  if (words.length >= 2) {
    // Multiple words: first letter of first two words
    return [
      words[0].charAt(0).toUpperCase() || '?',
      words[1].charAt(0).toUpperCase() || '?'
    ];
  } else if (words.length === 1 && words[0].length >= 2) {
    // Single word: first two letters
    return [
      words[0].charAt(0).toUpperCase(),
      words[0].charAt(1).toUpperCase()
    ];
  } else if (words.length === 1) {
    // Single character word
    return [words[0].charAt(0).toUpperCase() || '?', '?'];
  }

  // Fallback
  return ['?', '?'];
}

/**
 * ContribuenteAvatar - Circular avatar with colored initials
 *
 * Displays a circular avatar with:
 * - Colored background from one of 10 Flokk bird-inspired themes
 * - Two-letter initials with two different colors (also from the theme)
 *
 * Theme selection is deterministic based on the contribuente's name/id,
 * so the same contribuente always gets the same avatar colors.
 */
export function ContribuenteAvatar({
  cognomeDenominazione,
  nome,
  size = 'default',
  id,
}: ContribuenteAvatarProps) {
  // Get initials
  const [initial1, initial2] = getInitials(cognomeDenominazione, nome);

  // Select theme deterministically
  const hashSource = id || `${cognomeDenominazione}${nome}`;
  const themeIndex = hashCode(hashSource) % AvatarThemes.length;
  const theme = AvatarThemes[themeIndex];

  // Resolve size: accept both AvatarSizes key or raw number
  const pixelSize = typeof size === 'number' ? size : AvatarSizes[size];

  // Calculate font size (approximately 40% of avatar size)
  const fontSize = Math.round(pixelSize * 0.4);

  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: '50%',
        backgroundColor: theme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Fonts.heading,
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        letterSpacing: '1px',
        flexShrink: 0,
      }}
    >
      <span style={{ color: theme.letter1 }}>{initial1}</span>
      <span style={{ color: theme.letter2 }}>{initial2}</span>
    </div>
  );
}
