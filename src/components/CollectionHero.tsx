type CollectionHeroProps = {
  eyebrow: string;
  iconSrc: string;
  title: string;
};

export function CollectionHero({ eyebrow, iconSrc, title }: CollectionHeroProps) {
  return (
    <div className="collection-hero">
      <img className="collection-hero-icon" src={iconSrc} alt="" />
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
    </div>
  );
}
