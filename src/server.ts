import chalk from 'chalk';
import app from './app';

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(chalk.blackBright(`Server is listening on port ${PORT}.`));
});
