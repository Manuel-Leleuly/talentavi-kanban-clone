import classNames from "classnames";

export const Avatar = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        "w-[30px] h-[30px] rounded-full bg-orange-400 text-white p-2 border border-white",
        "flex items-center justify-center",
        className
      )}
    >
      {name[0].toUpperCase()}
    </div>
  );
};
