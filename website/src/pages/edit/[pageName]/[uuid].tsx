import Navbar from "@/components/navbar/index.";
import Tiptap from "@/components/Tiptap/Tiptap";
import TreeView from "@/components/TreeView/TreeView";
import { getScrapedData } from "@/service/scrape";
import { TreeNode } from "@/shared/type";
import React, { useEffect, useState } from "react";

const EditContent = () => {
  const [allScrapedData, setAllScrapedData] = useState<any[]>([]); // Set correct type
  const [selectedContent, setSelectedContent] = useState<string>(""); // Correct spelling of selectedContent
  const [error, setError] = useState<string | null>(null); // Add proper type for error state
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null
  );

  // Function to fetch scraped data
  const fetchScrapedData = async () => {
    try {
      const data = await getScrapedData();

      console.log("data point 1", data.data);

      const updatedTreeData: TreeNode = {
        id: 0,
        name: "Pages",
        type: "folder",
        isExpanded: true,
        children: data.data.map((url: any) => {
          return {
            id: url.id,
            name: url.title ?? `random-${url.id}`,
            type: "folder",
            isExpanded: false,
            children: [
              {
                id: 1,
                name: "content",
                type: "file",
                content: url.content || "...", // Ensure content is correctly set
              },
            ],
          };
        }),
      };
      console.log("data point 2", data);

      setAllScrapedData(data.data); // Store scraped data
      setTreeData(updatedTreeData); // Set tree data after fetching
    } catch (e: any) {
      setError(e.message); // Handle any errors
    }
  };

  useEffect(() => {
    fetchScrapedData(); // Fetch data on initial render
  }, []);

  useEffect(() => {
    if (selectedContentId && allScrapedData.length > 0) {
      const selected = allScrapedData.find(
        (data: any) => data?.id === selectedContentId
      );
      if (selected) {
        setSelectedContent(selected.content || ""); // Set content based on selected ID
      }
    }
  }, [selectedContentId, allScrapedData]); // Trigger this effect when the selectedContentId or allScrapedData changes

  return (
    <div className="container mx-auto">
      <div className=" max-w-7xl">
        <Navbar />
      </div>
      <div className="flex justify-between max-w-7xl">
        <div className="w-full grid grid-flow-row-dense grid-cols-6 min-h-screen ">
          <div className="col-span-1">
            {treeData && (
              <TreeView
                treeViewData={treeData}
                setSelectedContentId={setSelectedContentId}
              />
            )}
          </div>
          <div className="text-center col-span-5 border border-red-600">
            <Tiptap content={selectedContent} contentId={selectedContentId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContent;
