import faker from "faker";

const createRandomProject = () => {
  return {
    projectName: faker.company.companyName,
    id: faker.datatype.uuid,
    status: faker.random.arrayElement(["inProgress", "lost", "won"]),
    creationDate: faker.date.recent(),
  };
};

export const createRandomProjects = (numberOfProjects: number) => {
  let projects = [];
  for (let i = 0; 0 < numberOfProjects; i++) {
    projects.push(createRandomProject());
  }
  return projects;
};
