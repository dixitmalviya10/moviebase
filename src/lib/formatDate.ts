import moment from "moment";

export const formatDate = (date: string) => {
  const fDate = moment(date).format("DD/MMMM/YYYY");
  return fDate;
};
