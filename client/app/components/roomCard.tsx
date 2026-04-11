"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { MeetingRoom } from "../models/MeetingRoom";

type Props = {
  room: MeetingRoom;
  onClick: () => void;
};

const RoomCard: React.FC<Props> = ({ room, onClick }) => {
  return (
    <Card
      sx={{
        borderRadius: "8px",
        border: "1px solid #E7E8E9",
        boxShadow: "0 1px 3px 0px #131A2614",
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box
          sx={{
            height: 160,
            backgroundColor: "#F0F1F2",
            backgroundImage: `url(${room.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!room.imageUrl && (
            <Typography sx={{ color: "#71767D", fontSize: "14px" }}>
              No image
            </Typography>
          )}
        </Box>
        <CardContent sx={{ p: 2 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#131A26",
            }}
          >
            {room.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#71767D",
              lineHeight: "20px",
            }}
          >
            {room.location}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#71767D",
              lineHeight: "20px",
            }}
          >
            Up to {room.capacity} people
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RoomCard;
