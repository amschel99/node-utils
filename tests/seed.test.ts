import { setupDB } from "../src";
test("Seeding the database works correctly", ()=>{
    setupDB("myDb",true,"")
})