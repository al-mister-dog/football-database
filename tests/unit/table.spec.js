import Table from "../../src/components/Table.vue";
import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { mount } from "@vue/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "whatWg-fetch";

describe("fetch requests on created", () => {
  it("Makes a get-data post request on mounting", async () => {
    let requestBody;
    const server = setupServer(
      rest.post("http://localhost:4000/get-data", (req, res, ctx) => {
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );
    server.listen();

    render(Table, {
      props: { stat: "" },
    });

    await server.close();
    expect(requestBody).toEqual({});
  });

  it("Sends team Id on get-data post request if team Id is provided", async () => {
    let requestBody;
    const server = setupServer(
      rest.post("http://localhost:4000/get-data", (req, res, ctx) => {
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );
    server.listen();

    render(Table, {
      props: { teamId: "1", stat: "" },
    });

    await server.close();
    expect(requestBody).toEqual({ id: "1" });
  });

  it("Makes a stat post request on mounting if stat is not empty string", async () => {
    let requestBody;
    const server = setupServer(
      rest.post("http://localhost:4000/get-stats", (req, res, ctx) => {
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );
    server.listen();

    render(Table, {
      props: { stat: "string" },
    });

    await server.close();
    expect(requestBody).toEqual({ stat: "string" });
  });
});

describe("filter functionality", () => {
  it("sets tableIsFilteredToTrue when onClickCell is called", async () => {
    const wrapper = mount(Table, {
      props: { stat: "" },
    });
    await wrapper.setData({ tableIsFiltered: null });
    wrapper.vm.onClickCell("field", "value", 0);
    expect(wrapper.vm.tableIsFiltered).toBe(true);
  });
});

it('pushes field and value into "selected" array when onClickCell is called', async () => {
  const wrapper = mount(Table, {
    props: { stat: "" },
  });
  wrapper.vm.onClickCell("field", "value", 0);
  expect(wrapper.vm.selected).toEqual([{ field: "field", value: "value" }]);
});

it("makes a post request to /filter with selected fields when onClickCell is called", async () => {
  let requestBody;
  const server = setupServer(
    rest.post("http://localhost:4000/filter", (req, res, ctx) => {
      requestBody = req.body;
      return res(ctx.status(200));
    })
  );
  server.listen({ onUnhandledRequest: "bypass" });

  const wrapper = mount(Table, {
    props: { stat: "" },
  });
  wrapper.vm.onClickCell("field", "value", 0);
  await server.close();
  expect(requestBody.selected).toEqual([{ field: "field", value: "value" }]);
});

describe("Sort Functionality", () => {
  it("Toggles arrangementOrder when onSort is called", async () => {
    const wrapper = mount(Table, {
      props: { stat: "" },
    });
    await wrapper.setData({ direction: false });
    wrapper.vm.onSort("field");
    expect(wrapper.vm.direction).toBe(true)
  });
  
  it("makes a post request to /sort with selected fields when onClickCell is called", async () => {
    let requestBody;
    const server = setupServer(
      rest.post("http://localhost:4000/sort", (req, res, ctx) => {
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );
    server.listen({ onUnhandledRequest: "bypass" });
  
    const wrapper = mount(Table, {
      props: { stat: "" },
    });
    wrapper.vm.onSort("field");
    await server.close();
    expect(requestBody).toEqual({ field: 'field', selected: [], direction: true });
  });
});
