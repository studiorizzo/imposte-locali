import { Colors, Sizes, Fonts } from '../../theme';

export function Header() {
  return (
    <header
      className="flex items-center"
      style={{
        backgroundColor: Colors.bg1,
        height: Sizes.headerHeight,
      }}
    >
      <div className="w-full px-4">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: Fonts.heading,
            color: Colors.headerTitle,
          }}
        >
          imuendo
        </h1>
      </div>
    </header>
  );
}
