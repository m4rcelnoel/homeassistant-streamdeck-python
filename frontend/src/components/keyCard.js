import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import kitchen from "Assets/images/kitchen_lamp.png";

function keyCard() {
  return (
    <div className="keyCard">
      <Grid
        container
        rowSpacing={1}
        justifyContent="space-around"
        alignItems="center"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={6} md={2.4} lg={2.4}>
          <Card  sx={{ maxWidth: 200 }} >
            <CardMedia
              component="img"
              style={{ width: 150, height: 150}}
              image={kitchen}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Küche
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default keyCard;
