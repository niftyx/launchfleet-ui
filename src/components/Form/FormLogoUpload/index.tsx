import {
  CircularProgress,
  FormControl,
  FormControlProps,
  makeStyles,
} from "@material-ui/core";
import CameraEnhanceOutlinedIcon from "@material-ui/icons/CameraEnhanceOutlined";
import clsx from "clsx";
import { LOGO_IMAGE_FILE_SIZE_LIMIT } from "config/constants";
import { useSnackbar } from "notistack";
import React from "react";

const AVATAR_SIZE = 100;

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    display: "none",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: "50%",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: `2px solid ${theme.colors.third}`,
    backgroundColor: theme.colors.primary,
  },
  selectorButton: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: theme.colors.default,
    cursor: "pointer",
    userSelect: "none",
    border: `1px dashed ${theme.colors.transparent}`,
    transition: "all 0.5s",
    "&:hover": {
      borderColor: theme.colors.default,
    },
  },
}));

interface InputProps {
  id: string;
  name: string;
  value: File | null;
  placeholder?: string;
  onBlur: (e: React.FocusEvent<any>) => void;
  onChange: (_: File | null) => void;
}

interface IProps {
  className?: string;
  FormControlProps: FormControlProps;
  InputProps: InputProps;
  imageUrl: string;
  loading: boolean;
}

export const FormLogoUpload = (props: IProps) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    InputProps: { onChange, value, ...restInputProps },
    className,
    imageUrl,
    loading,
  } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const onChangeFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > LOGO_IMAGE_FILE_SIZE_LIMIT) {
        return enqueueSnackbar("File size is larger than 10MG", {
          variant: "warning",
        });
      }
      onChange(event.target.files[0]);
      (event.target as any).value = null;
    }
  };

  return (
    <FormControl
      className={clsx(classes.root, className)}
      {...props.FormControlProps}
    >
      <input
        accept="image/*"
        className={classes.input}
        onChange={onChangeFiles}
        type="file"
        {...restInputProps}
      />
      <div
        className={classes.content}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "" }}
      >
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <label className={classes.selectorButton} htmlFor={restInputProps.id}>
            <CameraEnhanceOutlinedIcon />
          </label>
        )}
      </div>
    </FormControl>
  );
};
