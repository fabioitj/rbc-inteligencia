const API = {
  domain: "localhost:5000",
};

export default async function Page({ params }: { params: { model: string } }) {
  let myObject: any = {},
    err: any = {};
  const APIResponse = await fetch(`${API.domain}/casos/${params.model}`)
    .then((res) => res.json())
    .then((json) => {
      //TODO: TREAT JSON
      myObject = {
        id: 1,
        name: "FICOU GOSTOSONA",
      };
    })
    .catch((errFetch) => {
      if (errFetch instanceof Error) {
        err = errFetch;
      }
      err.isError = true;
    });
  return err.isError ? (
    <div>Error: {err.message}</div>
  ) : (
    <div>My Name: {myObject.name}</div>
  );
}
