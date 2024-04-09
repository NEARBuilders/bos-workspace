const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";

const className = props.className ?? "group-image d-inline-block";
const style = props.style ?? { width: "3em", height: "3em" };
const imageStyle = props.imageStyle ?? { objectFit: "cover" };
const imageClassName = props.imageClassName ?? "rounded w-100 h-100";
const thumbnail = props.thumbnail ?? "thumbnail";

const group = props.group;

const name = group.name || "No-name group";
const image = group.image;
const title = props.title ?? `${name} @${accountId}`;
const tooltip =
  props.tooltip && (props.tooltip === true ? title : props.tooltip);
const fallbackUrl =
  "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm";

const inner = (
  <div className={className} style={style} key={JSON.stringify(image)}>
    <Widget
      src="mob.near/widget/Image"
      props={{
        image: group.image,
        alt: title,
        className: imageClassName,
        style: imageStyle,
        thumbnail,
        fallbackUrl,
      }}
    />
  </div>
);

return props.tooltip ? (
  <>
    <Widget
      src="devs.near/widget/group.overlay.trigger"
      props={{ groupId, accountId, children: inner }}
    />
  </>
) : (
  inner
);