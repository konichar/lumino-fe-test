import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, TextField, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Button, Card, Stack } from '@mui/material';
import React, { useEffect, useState } from "react";
import debouce from 'lodash.debounce';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
interface ProjectItem {
  creationDate: any;
  projectName: any;
  id: any;
  status: string;
}

const useStyles = makeStyles({
  root: {
    margin: 10,
  },
});

interface CardProps {
  date: any;
  name: string;
  status: string;
}

const useCardStyles = makeStyles({
  root: {
    width: 350,
    margin: 10,
    padding: 20,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 10,
  },
});

const ProjectCard: React.FC<CardProps> = ({ date, name, status }) => {
  const classes = useCardStyles();
  const toDate = new Date(date);

  return (
    <Card className={classes.root} variant="outlined">
      <div>
        <Typography
          data-testid="date"
          className={classes.title}
          color="textSecondary"
        >
          {toDate.toUTCString()}
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography style={{ color: "white", marginBottom: 10 }}>
          {status}
        </Typography>
      </div>
    </Card>
  );
};

function App() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<DateRange<Date>>([null, null]);
  // let sortedProjects = [...projects];

  const classes = useStyles();

  // Specify that API is called once on page load
  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchProjects();
      setProjects(projectsFromServer.data);
    };
    getProjects();
  }, []);

  // Fetch Projects
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3004/projects");
    const data = await res.json();
    return data;
  };

  function handleChange(sortedType: "earliest" | "latest") {
    const sorted = [...projects].sort((a, b) => {
      let date1 = new Date(a.creationDate);
      let date2 = new Date(b.creationDate);

      if (sortedType === "earliest") {
        return date1.getTime() - date2.getTime();
      } else if (sortedType === "latest") {
        return date2.getTime() - date1.getTime();
      } else {
        return 0;
      }
    });
    setProjects(sorted);
  }

  // chaining jsfilters 
  const filteredProjects = projects
    // Search filter
    .filter(project => {
      let statusfilter = (project?.status === status || status === "")
      let searchfilter = (project?.projectName?.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      let dateFilter = (startDate[0] && startDate[1]) ? (new Date(project.creationDate) >= startDate[0] && new Date(project.creationDate) <= startDate[1]) : true
      return searchfilter && statusfilter && dateFilter
    })


  const handleSearch = debouce(e => {
    setSearch(e.target.value);
    // Fire API call or Comments manipulation on client end side
  }, 1000);

  const handleStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  // render App
  return (
    <div className="App">
      <Stack direction="row" justifyContent={"center"} spacing={4} marginTop={4} marginBottom={2} sx={{ paddingX: 14 }}>
        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("earliest")}
          data-testid="earliest-button"
        >
          Earliest
        </Button>

        <TextField
          onChange={(e) => handleSearch(e)}
          id="outlined-basic" label="Search" variant="outlined" />
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            variant="outlined"
            value={status}
            label="Status"
            onChange={(e) => handleStatus(e)}
          >
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={"inProgress"}>In progress</MenuItem>
            <MenuItem value={"won"}>Won</MenuItem>
            <MenuItem value={"lost"}>Lost</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="from"
            endText="to"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>

        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("latest")}
          data-testid="latest-button"
        >
          Latest
        </Button>
      </Stack>

      <div className="projects-content">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            // the data from the api is comming with duplicate ids could not use for keys
            key={index}
            date={project.creationDate}
            name={project.projectName}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
