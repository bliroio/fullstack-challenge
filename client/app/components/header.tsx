import { AppBar, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
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
      </Toolbar>
    </AppBar>
  );
}
