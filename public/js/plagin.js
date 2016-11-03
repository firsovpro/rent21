$(function() {

    var dhxWins = new dhtmlXWindows();
	//dhxWins.attachViewportTo(document);
	var w1 = dhxWins.createWindow("w1", 20, 30, 900, 600);
	var myLayout = w1.attachLayout({

				pattern: "3L",
				cells: [{id: "a", header: false},{id: "b", header: false},{id: "c", header: false}]
			});
			myToolbar = myLayout.cells("a").attachToolbar({
				icons_path: "//vfirsov.ru:455/js/dhtmlx/common/imgs/"
			});

			var newOpts = Array(	Array('new_text', 'obj', 'Text Document', 'text_document.gif'),
						Array('new_excel','obj', 'Stylesheet'   , 'stylesheet.gif'),
						Array('new_db',   'obj', 'Database'     , 'database.gif'),
						Array('new_pp',   'obj', 'Presentation' , 'presentation.gif'),
						Array('new_s1',   'sep'),
						Array('new_other','obj', 'Other'        , 'other.gif'));

			myToolbar.addButtonSelect("new", 0, "Создать", newOpts, "new.gif", "new_dis.gif");

	//w1.setText("dhtmlxWindow #1");
});