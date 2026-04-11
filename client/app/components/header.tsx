import { AppBar, Button, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  onCreateClick?: () => void;
};

export default function Header({ onCreateClick }: Props) {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <img
          src="/bliro_logo.svg"
          alt="YouWork Logo"
          style={{ height: 24, cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
        {onCreateClick && (
          <Button variant="contained" onClick={onCreateClick}>
            Book a Meeting
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
