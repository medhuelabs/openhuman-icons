import { defineComponent, h, type PropType } from "vue";

type IconNode = [string, Record<string, string>];

const toDomAttribute = (attribute: string) =>
  attribute.replace(/-([a-z])/g, (_, character: string) =>
    character.toUpperCase(),
  );

export default defineComponent({
  name: "SvgIcon",
  props: {
    nodes: {
      type: Array as PropType<IconNode[]>,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: "#08758a",
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    absoluteStrokeWidth: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () => {
      const strokeWidth = props.absoluteStrokeWidth
        ? (props.strokeWidth * 24) / props.size
        : props.strokeWidth;
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: props.size,
          height: props.size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: props.color,
          "stroke-width": strokeWidth,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": props.label ? undefined : "true",
          "aria-label": props.label || undefined,
          role: props.label ? "img" : undefined,
        },
        props.nodes.map(([tag, attributes], index) =>
          h(tag, {
            ...Object.fromEntries(
              Object.entries(attributes).map(([key, value]) => [
                toDomAttribute(key),
                value,
              ]),
            ),
            key: index,
          }),
        ),
      );
    };
  },
});
