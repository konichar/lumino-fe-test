import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface CardProps {
  date: any;
  name: string;
  status: string;
}

const useStyles = makeStyles({
  root: {
    width: 350,
    margin: 10,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 10,
  },
});

const ProjectCard: React.FC<CardProps> = ({ date, name, status }) => {
  const classes = useStyles();
  const toDate = new Date(date);

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          data-testid="date"
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {toDate.toUTCString()}
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography style={{ color: "white", marginBottom: 10 }}>
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
