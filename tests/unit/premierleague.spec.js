import premData from "../premTable";
import PremierLeague from "../../src/components/PremierLeague.vue";
import "@testing-library/jest-dom";
import { render } from "@testing-library/vue";
import { mount } from "@vue/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";
import "whatWg-fetch";

const url = "https://app.sportdataapi.com/api/v1/soccer/standings";

describe("Premier League Table", () => {
  it("makes a get request on mounting", async () => {
    let requestBody;
    const server = setupServer(
      rest.get(url, (req, res, ctx) => {
        requestBody = { success: true };
        return res(ctx.status(200));
      })
    );
    server.listen();

    render(PremierLeague);

    await server.close();
    
    expect(requestBody).toEqual({ success: true });
  });

  it("sorts a table when onSort is called", () => {
    const wrapper = mount(PremierLeague);
    wrapper.setData({ tableToParse: premData });  

    wrapper.vm.onSort("L");
    const result = wrapper.vm.leagueTable;

    expect(result[0].team).toBe('Sheffield Utd')
  });

  it("sorts a table when onSort is called", () => {
    const wrapper = mount(PremierLeague);
    wrapper.setData({ tableToParse: premData });  

    wrapper.vm.onClickTeam("Arsenal");
    const result = wrapper.vm.teamName;

    expect(result).toBe('Arsenal')
  });
});
