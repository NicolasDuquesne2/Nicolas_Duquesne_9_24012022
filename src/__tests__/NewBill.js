/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen } from "@testing-library/dom";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i should load a file with .jpg/.jpeg/.png extention", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    })
  })
})
